import datetime
from typing import Dict, Any, List
from backend.data.emission_factors import (
    ELECTRICITY_GRID_FACTORS,
    FUEL_EMISSION_FACTORS,
    PRECURSOR_DEFAULT_FACTORS
)

class CalculatorAgent:
    """
    Calculator Agent:
    Performs strictly deterministic arithmetic for CBAM embedded emissions calculations.
    No LLM hallucinations: every figure is computed via documented mathematical formulas
    following EU CBAM Implementing Regulation (EU) 2023/1773.
    """

    def calculate(
        self,
        case_data: Dict[str, Any],
        extracted_fields: List[Dict[str, Any]],
        region: str = "India - National Average",
        fuel_type: str = "Furnace Oil / Heavy Fuel Oil"
    ) -> Dict[str, Any]:
        product_quantity = float(case_data.get("product_quantity", 1.0))
        quantity_unit = case_data.get("quantity_unit", "MT")
        category = case_data.get("product_category", "Iron and Steel")

        # Map extracted items
        field_map = {f["field_name"]: f for f in extracted_fields}

        # 1. Scope 2: Indirect Electricity Emissions
        elec_field = field_map.get("electricity_consumption")
        electricity_kwh = float(elec_field.get("numeric_value", 0.0)) if elec_field else 0.0
        elec_doc = elec_field.get("source_file_name", "Electricity Bill") if elec_field else "N/A"

        grid_factor_info = ELECTRICITY_GRID_FACTORS.get(region, ELECTRICITY_GRID_FACTORS["India - National Average"])
        elec_factor = grid_factor_info["factor"]  # kg CO2e / kWh

        # Formula: E_indirect (tCO2e) = (Electricity_kWh * Factor_kg_per_kWh) / 1000
        indirect_emissions_tco2e = round((electricity_kwh * elec_factor) / 1000.0, 4)

        # 2. Scope 1: Direct Combustion Emissions
        fuel_factor_info = FUEL_EMISSION_FACTORS.get(fuel_type, FUEL_EMISSION_FACTORS["Furnace Oil / Heavy Fuel Oil"])
        fuel_factor = fuel_factor_info["factor"]  # kg CO2e / unit

        fuel_field = field_map.get("fuel_consumption")
        measured_direct = field_map.get("measured_direct_emissions")
        if measured_direct:
            direct_emissions_tco2e = round(float(measured_direct.get("numeric_value", 0.0)), 4)
            fuel_amount = direct_emissions_tco2e
            fuel_unit = "tCO2"
            fuel_doc = measured_direct.get("source_file_name", "CSV Plant CEM Record")
        elif fuel_field:
            fuel_amount = float(fuel_field.get("numeric_value", 0.0))
            fuel_unit = fuel_field.get("unit", "Liters")
            fuel_doc = fuel_field.get("source_file_name", "Fuel Record")
            # Formula: E_direct (tCO2e) = (Fuel_amount * Factor_kg_per_unit) / 1000
            direct_emissions_tco2e = round((fuel_amount * fuel_factor) / 1000.0, 4)
        else:
            fuel_amount = 0.0
            fuel_unit = "Liters"
            fuel_doc = "N/A"
            direct_emissions_tco2e = 0.0

        # 3. Precursor Embedded Emissions (Scope 3 Upstream)
        precursor_field = field_map.get("precursor_emissions_data")
        supplier_resp = case_data.get("supplier_response") or {}
        is_dropped = bool(
            case_data.get("precursor_dropped") or
            supplier_resp.get("scenario") in ["unavailable", "drop_missing"] or
            case_data.get("drop_missing") or
            (precursor_field and (
                precursor_field.get("dropped") or 
                float(precursor_field.get("numeric_value", 1.0)) == 0.0 or 
                "dropped" in str(precursor_field.get("extracted_value", "")).lower() or
                "dropped" in str(precursor_field.get("field_label", "")).lower()
            ))
        )

        if is_dropped:
            precursor_name = "Direct Reduced Iron (DRI / Sponge Iron) - Excluded / Dropped"
            precursor_amount = 0.0
            precursor_factor = 0.0
            precursor_emissions_tco2e = 0.0
            precursor_doc = "Exporter Authorization (Scope 1+2 Boundary)"
        else:
            precursor_amount = float(precursor_field.get("numeric_value", 0.0)) if precursor_field else (product_quantity * 1.08)
            precursor_doc = precursor_field.get("source_file_name", "Precursor Supplier Declaration") if precursor_field else "Default Benchmark"

            # Lookup precursor factor based on category
            if "Aluminium" in category:
                precursor_name = "Aluminium Ingot (Unwrought Primary)"
            elif "Cement" in category:
                precursor_name = "Cement Clinker"
            elif "Fertilizer" in category:
                precursor_name = "Ammonia (Anhydrous)"
            else:
                precursor_name = "Direct Reduced Iron (DRI / Sponge Iron)"

            precursor_factor_info = PRECURSOR_DEFAULT_FACTORS.get(precursor_name, PRECURSOR_DEFAULT_FACTORS["Direct Reduced Iron (DRI / Sponge Iron)"])
            precursor_factor = precursor_factor_info["factor"]  # tCO2e / MT

            # Formula: E_precursor (tCO2e) = Precursor_quantity (MT) * Precursor_Factor (tCO2e/MT)
            precursor_emissions_tco2e = round(precursor_amount * precursor_factor, 4)

        # 4. Total Embedded Emissions & Intensity
        # Total (tCO2e) = Direct + Indirect + Precursor
        total_embedded_emissions = round(direct_emissions_tco2e + indirect_emissions_tco2e + precursor_emissions_tco2e, 4)

        # Intensity = Total Emissions / Product Quantity (tCO2e / MT)
        emissions_intensity = round(total_embedded_emissions / max(product_quantity, 0.001), 4)

        calculation_result = {
            "methodology": "EU CBAM Annex IV (Specific Embedded Emissions: Direct + Indirect + Precursors)",
            "methodology_version": "Commission Implementing Regulation (EU) 2023/1773",
            "calculation_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "product_quantity": product_quantity,
            "quantity_unit": quantity_unit,
            "direct_emissions": direct_emissions_tco2e,
            "indirect_emissions": indirect_emissions_tco2e,
            "precursor_emissions": precursor_emissions_tco2e,
            "total_embedded_emissions": total_embedded_emissions,
            "emissions_intensity": emissions_intensity,
            "intensity_unit": f"tCO2e / {quantity_unit}",
            "calculation_breakdown": {
                "direct_combustion": {
                    "input_value": fuel_amount,
                    "input_unit": fuel_unit,
                    "source_document": fuel_doc,
                    "fuel_type": fuel_type,
                    "emission_factor": fuel_factor,
                    "factor_unit": fuel_factor_info["unit"],
                    "factor_source": fuel_factor_info["source"],
                    "formula": f"({fuel_amount} {fuel_unit} × {fuel_factor}) / 1000",
                    "result_tco2e": direct_emissions_tco2e
                },
                "indirect_electricity": {
                    "input_value": electricity_kwh,
                    "input_unit": "kWh",
                    "source_document": elec_doc,
                    "grid_region": region,
                    "emission_factor": elec_factor,
                    "factor_unit": grid_factor_info["unit"],
                    "factor_source": grid_factor_info["source"],
                    "formula": f"({electricity_kwh} kWh × {elec_factor}) / 1000",
                    "result_tco2e": indirect_emissions_tco2e
                },
                "precursor_materials": {
                    "precursor_name": precursor_name,
                    "input_value": precursor_amount,
                    "input_unit": "MT",
                    "source_document": precursor_doc,
                    "emission_factor": precursor_factor,
                    "factor_unit": precursor_factor_info["unit"],
                    "factor_source": precursor_factor_info["source"],
                    "formula": f"{precursor_amount} MT × {precursor_factor} tCO2e/MT",
                    "result_tco2e": precursor_emissions_tco2e
                }
            },
            "emission_factors_used": {
                "electricity": grid_factor_info,
                "fuel": fuel_factor_info,
                "precursor": precursor_factor_info
            }
        }

        return calculation_result

