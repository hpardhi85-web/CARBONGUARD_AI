"""
Official Emission Factors Database for CarbonGuard AI
Sources:
1. CEA (Central Electricity Authority, Ministry of Power, Govt of India) - CO2 Baseline Database for the Indian Power Sector (Ver 19/20)
2. 2006 IPCC Guidelines for National Greenhouse Gas Inventories
3. EU CBAM Implementing Regulation (EU) 2023/1773 & Commission Guidance for Non-EU Installations
"""

# Grid Electricity Emission Factors (kg CO2e per kWh)
ELECTRICITY_GRID_FACTORS = {
    "India - National Average": {
        "factor": 0.716,
        "unit": "kg CO2e / kWh",
        "source": "CEA CO2 Baseline Database v19 (Govt of India)",
        "year": 2024,
        "geographic_scope": "India (All-India Grid)",
    },
    "India - Western Region": {
        "factor": 0.755,
        "unit": "kg CO2e / kWh",
        "source": "CEA Regional Baseline",
        "year": 2024,
        "geographic_scope": "Maharashtra, Gujarat, MP, Goa, Chhattisgarh",
    },
    "India - Southern Region": {
        "factor": 0.680,
        "unit": "kg CO2e / kWh",
        "source": "CEA Regional Baseline",
        "year": 2024,
        "geographic_scope": "Tamil Nadu, Karnataka, AP, Telangana, Kerala",
    },
    "India - Northern Region": {
        "factor": 0.742,
        "unit": "kg CO2e / kWh",
        "source": "CEA Regional Baseline",
        "year": 2024,
        "geographic_scope": "Punjab, Haryana, UP, Rajasthan, Delhi",
    },
    "India - Eastern Region": {
        "factor": 0.840,
        "unit": "kg CO2e / kWh",
        "source": "CEA Regional Baseline",
        "year": 2024,
        "geographic_scope": "West Bengal, Odisha, Jharkhand, Bihar",
    },
    "Renewable (Solar/Wind Onsite PPA)": {
        "factor": 0.000,
        "unit": "kg CO2e / kWh",
        "source": "RE100 / GHG Protocol Scope 2 Guidance",
        "year": 2024,
        "geographic_scope": "Direct Onsite",
    }
}

# Fuel Emission Factors (Direct Scope 1 Combustion)
FUEL_EMISSION_FACTORS = {
    "Furnace Oil / Heavy Fuel Oil": {
        "factor": 3.114,
        "unit": "kg CO2e / liter",
        "density_kg_per_l": 0.95,
        "source": "IPCC 2006 Stationary Combustion Table 2.2",
        "year": 2024,
    },
    "High Speed Diesel (HSD)": {
        "factor": 2.680,
        "unit": "kg CO2e / liter",
        "density_kg_per_l": 0.84,
        "source": "IPCC 2006 Guidelines",
        "year": 2024,
    },
    "Natural Gas (PNG)": {
        "factor": 2.020,
        "unit": "kg CO2e / SCM (standard cubic meter)",
        "source": "IPCC 2006 Fuel Factors",
        "year": 2024,
    },
    "Liquefied Petroleum Gas (LPG)": {
        "factor": 1.610,
        "unit": "kg CO2e / liter",
        "source": "IPCC 2006 Guidelines",
        "year": 2024,
    },
    "Non-Coking Thermal Coal": {
        "factor": 1.950,
        "unit": "kg CO2e / kg",
        "source": "IPCC 2006 / MoEFCC India GHG Inventory",
        "year": 2024,
    },
    "Coking Coal": {
        "factor": 2.420,
        "unit": "kg CO2e / kg",
        "source": "IPCC 2006 / World Steel Association",
        "year": 2024,
    }
}

# CBAM Precursor Default Emission Factors (tCO2e / metric tonne of precursor)
PRECURSOR_DEFAULT_FACTORS = {
    "Direct Reduced Iron (DRI / Sponge Iron)": {
        "factor": 1.92,
        "unit": "tCO2e / MT",
        "source": "EU CBAM Transitional Benchmark - Gas/Coal DRI",
        "category": "Iron and Steel",
    },
    "Pig Iron (Blast Furnace)": {
        "factor": 2.15,
        "unit": "tCO2e / MT",
        "source": "EU CBAM Guidance Document for Iron & Steel",
        "category": "Iron and Steel",
    },
    "Crude Steel - EAF Route (Scrap based)": {
        "factor": 0.45,
        "unit": "tCO2e / MT",
        "source": "EU CBAM Default Values",
        "category": "Iron and Steel",
    },
    "Crude Steel - BOF Route (Integrated)": {
        "factor": 1.89,
        "unit": "tCO2e / MT",
        "source": "EU CBAM Default Values",
        "category": "Iron and Steel",
    },
    "Aluminium Ingot (Unwrought Primary)": {
        "factor": 7.20,
        "unit": "tCO2e / MT",
        "source": "International Aluminium Institute / EU CBAM Default for India",
        "category": "Aluminium",
    },
    "Cement Clinker": {
        "factor": 0.83,
        "unit": "tCO2e / MT",
        "source": "EU CBAM Default for Clinker",
        "category": "Cement",
    },
    "Ammonia (Anhydrous)": {
        "factor": 2.10,
        "unit": "tCO2e / MT",
        "source": "EU CBAM Default for Ammonia Precursor",
        "category": "Fertilizers",
    }
}

# Product-to-CBAM classification mapping
CBAM_PRODUCT_CATEGORIES = {
    "Iron and Steel": {
        "cn_codes": ["7208 51 00", "7214 20 00", "7213 10 00", "7228 30 00", "7306 30 00"],
        "required_inputs": [
            "product_quantity",
            "production_volume",
            "electricity_consumption",
            "fuel_consumption",
            "precursor_raw_material",
            "scrap_consumption"
        ],
        "system_boundary": "Cradle-to-gate (Aggregated Goods Category: Steel Products)",
        "direct_emissions_mandatory": True,
        "indirect_emissions_mandatory": True,
        "precursor_mandatory": True,
    },
    "Aluminium": {
        "cn_codes": ["7601 10 00", "7601 20 00", "7604 10 10", "7606 11 00"],
        "required_inputs": [
            "product_quantity",
            "production_volume",
            "electricity_consumption",
            "precursor_raw_material"
        ],
        "system_boundary": "Cradle-to-gate (Smelting / Extrusion)",
        "direct_emissions_mandatory": True,
        "indirect_emissions_mandatory": True,
        "precursor_mandatory": True,
    },
    "Cement": {
        "cn_codes": ["2523 10 00", "2523 29 00"],
        "required_inputs": [
            "product_quantity",
            "clinker_consumption",
            "thermal_energy_fuel",
            "electricity_consumption"
        ],
        "system_boundary": "Calcination + Grinding",
        "direct_emissions_mandatory": True,
        "indirect_emissions_mandatory": True,
        "precursor_mandatory": True,
    },
    "Fertilizers": {
        "cn_codes": ["3102 10 00", "3102 30 00"],
        "required_inputs": [
            "product_quantity",
            "natural_gas_feedstock",
            "electricity_consumption",
            "ammonia_input"
        ],
        "system_boundary": "Ammonia / Nitric Acid / Urea synthesis",
        "direct_emissions_mandatory": True,
        "indirect_emissions_mandatory": True,
        "precursor_mandatory": True,
    },
    "Hydrogen": {
        "cn_codes": ["2804 10 00"],
        "required_inputs": [
            "hydrogen_mass",
            "electricity_kwh_or_gas_feedstock"
        ],
        "system_boundary": "Electrolysis or SMR",
        "direct_emissions_mandatory": True,
        "indirect_emissions_mandatory": True,
        "precursor_mandatory": False,
    }
}

