from typing import List, Dict, Any, Tuple
from backend.data.emission_factors import CBAM_PRODUCT_CATEGORIES

class MissingDataChecker:
    """
    Missing Data Checker:
    Compares extracted fields against required inputs for the specific CBAM category.
    Identifies missing data items, conflicting values, and missing units.
    """

    def check(self, category: str, extracted_fields: List[Dict[str, Any]], supplier_info: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        missing_items: List[Dict[str, Any]] = []
        conflicts: List[Dict[str, Any]] = []

        cat_config = CBAM_PRODUCT_CATEGORIES.get(category, CBAM_PRODUCT_CATEGORIES.get("Iron and Steel"))
        available_field_names = {f["field_name"]: f for f in extracted_fields}

        # 1. Product Quantity Check
        if "product_quantity" not in available_field_names:
            missing_items.append({
                "field_name": "product_quantity",
                "description": "Commercial invoice or dispatch note with certified net quantity and unit (MT/kg)",
                "priority": "mandatory",
                "is_supplier_data": False,
                "status": "missing"
            })
        else:
            q_field = available_field_names["product_quantity"]
            if not q_field.get("unit"):
                conflicts.append({
                    "field_name": "product_quantity",
                    "issue": "Missing quantity measurement unit",
                    "severity": "high"
                })

        # 2. Electricity Consumption Check (Mandatory for indirect emissions)
        if cat_config.get("indirect_emissions_mandatory"):
            if "electricity_consumption" not in available_field_names:
                missing_items.append({
                    "field_name": "electricity_consumption",
                    "description": "Monthly industrial electricity utility bills (Discom/Bescom/MSEDCL) or production meter log showing active kWh consumed",
                    "priority": "mandatory",
                    "is_supplier_data": False,
                    "status": "missing"
                })

        # 3. Direct Fuel Consumption Check
        if cat_config.get("direct_emissions_mandatory"):
            if "fuel_consumption" not in available_field_names and "measured_direct_emissions" not in available_field_names:
                missing_items.append({
                    "field_name": "fuel_consumption",
                    "description": "Fuel purchase invoices or furnace log records (Furnace Oil in Liters, Diesel in Liters, PNG in SCM, or Coal in kg)",
                    "priority": "mandatory",
                    "is_supplier_data": False,
                    "status": "missing"
                })

        # 4. Precursor Raw Material Emissions Check
        if cat_config.get("precursor_mandatory"):
            has_precursor = any(f["field_name"] in ["precursor_emissions_data", "raw_material_cert"] for f in extracted_fields)
            if not has_precursor:
                missing_items.append({
                    "field_name": "precursor_emissions_data",
                    "description": f"Supplier-specific embedded emissions or certified purchase note for primary upstream precursor (e.g. DRI, Pig Iron, Aluminium Ingot) from {supplier_info.get('supplier_company', 'Supplier')}",
                    "priority": "mandatory",
                    "is_supplier_data": True,
                    "status": "missing"
                })

        # 5. Incomplete Supplier Information Check
        if not supplier_info.get("supplier_email"):
            conflicts.append({
                "field_name": "supplier_email",
                "issue": "Supplier contact email is missing; autonomous outreach cannot proceed",
                "severity": "critical"
            })

        return missing_items, conflicts

