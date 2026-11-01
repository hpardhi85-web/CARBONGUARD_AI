import os
import sys
import psycopg2
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "sample_documents")
os.makedirs(DOCS_DIR, exist_ok=True)

def build_pdf(filename, title, subtitle, rows, notes=None):
    filepath = os.path.join(DOCS_DIR, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()

    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1c2b14'),
        fontName='Helvetica-Bold'
    )
    sub_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#555555')
    )
    cell_style = ParagraphStyle(
        'CellText',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#222222')
    )
    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=11,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#1c2b14')
    )

    story = []
    story.append(Paragraph(title, header_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(subtitle, sub_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1c2b14'), spaceAfter=14))

    table_data = []
    for r in rows:
        row_cells = []
        for i, val in enumerate(r):
            style = cell_bold if i == 0 else cell_style
            row_cells.append(Paragraph(str(val), style))
        table_data.append(row_cells)

    t = Table(table_data, colWidths=[180, 360])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fbfdfa')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#d0dcd0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e8eee8')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t)

    if notes:
        story.append(Spacer(1, 14))
        story.append(Paragraph(f"<b>Official Compliance Attestation:</b> {notes}", sub_style))

    doc.build(story)
    print(f"Generated sample document: {filename} ({os.path.getsize(filepath)} bytes)")
    return filepath

def generate_all_sample_docs():
    docs = []
    # 1. Commercial Export Invoice
    docs.append({
        "filename": "Commercial_Export_Invoice_APEX_2026_044.pdf",
        "title": "APEX FORGINGS & STEEL PRODUCTS PVT LTD",
        "subtitle": "Commercial Export Invoice | Ref: INV/EXP/2026/044 | Date: 12-Feb-2026",
        "rows": [
            ("Exporter / Manufacturer", "Apex Forgings & Steel Products Pvt Ltd, Focal Point, Ludhiana, Punjab"),
            ("Buyer / Consignee", "Krupp Bautechnik GmbH, Hamburg, Germany"),
            ("Product Description", "Hot-Rolled Structural Alloy Steel Bars (Fe500D CBAM Grade)"),
            ("Harmonized System (HS / CN) Code", "7214 20 00"),
            ("Certified Net Product Quantity", "48.66 Metric Tons (MT)"),
            ("Gross Dispatched Weight", "49.20 Metric Tons (MT)"),
            ("Port of Loading & Discharge", "Mundra Port, Gujarat, India -> Port of Hamburg, Germany"),
            ("Manufacturing Batch Period", "January 2026 - March 2026")
        ],
        "notes": "Certified that products described herein conform to EU CBAM transitional-to-definitive reporting provisions."
    })

    # 2. Mill Test Certificate
    docs.append({
        "filename": "Mill_Test_Certificate_HT88421.pdf",
        "title": "MILL TEST & QUALITY INSPECTION CERTIFICATE",
        "subtitle": "EN 10204 Type 3.1 Certified | Certificate No: MTC-HT88421-2026",
        "rows": [
            ("Manufacturing Mill", "Apex Forgings & Steel Products, Unit 3 Rolling Mill, Ludhiana"),
            ("Heat / Melt Lot Number", "HT88421"),
            ("Steel Grade Specification", "Fe500D High Ductility CBAM Ready"),
            ("Certified Net Billet & Bar Weight", "48.66 Metric Tons (MT)"),
            ("Yield Strength (MPa)", "525 MPa (Standard >= 500 MPa)"),
            ("Tensile Strength (MPa)", "620 MPa (Standard >= 545 MPa)"),
            ("Carbon Equivalent (CE)", "0.38% (Low Carbon Green Steel Profile)"),
            ("Inspection Date", "15-Feb-2026")
        ],
        "notes": "100% material conforms strictly to DIN 488 and IS 1786 specifications for export dispatch."
    })

    # 3. Electricity Bill
    docs.append({
        "filename": "PSPCL_Industrial_Electricity_Bill_Q1.pdf",
        "title": "PUNJAB STATE POWER CORPORATION LIMITED (PSPCL)",
        "subtitle": "HT Industrial Energy Billing Statement | Account No: 3002918841 | Period: Jan-Mar 2026",
        "rows": [
            ("Consumer Name & Address", "Apex Forgings & Steel Products Pvt Ltd, HT Industrial Zone 3"),
            ("Sub-Station & Feeder Line", "66kV Focal Point Substation / Feeder 4"),
            ("Sanctioned Contract Demand", "1250 kVA"),
            ("Meter Initial Reading (01-Jan-2026)", "4,180,240.0 kWh"),
            ("Meter Final Reading (31-Mar-2026)", "4,200,677.2 kWh"),
            ("Total Consumed Electricity (Scope 2)", "20,437.20 kWh"),
            ("Grid Emission Reference Standard", "CEA CO2 Baseline Database v19 (Central Electricity Authority, India)"),
            ("Grid Baseline Emission Factor", "0.716 kg CO2e / kWh")
        ],
        "notes": "Verified utility meter recorded consumption allocated to induction furnace line."
    })

    # 4. Furnace Oil Invoice
    docs.append({
        "filename": "IOCL_Furnace_Oil_Fuel_Invoice_981.pdf",
        "title": "INDIAN OIL CORPORATION LIMITED (IOCL)",
        "subtitle": "Tax Invoice for Industrial Liquid Fuel | Invoice No: IOCL-NRO-981742 | Date: 18-Jan-2026",
        "rows": [
            ("Supplied To", "Apex Forgings & Steel Products Pvt Ltd, Unit 3"),
            ("Fuel Description", "Industrial Furnace Oil (FO 180 cSt, Heavy Fuel Oil)"),
            ("Delivered Fuel Volume (Scope 1)", "1,727.40 Liters"),
            ("Fuel Density at 15°C", "0.932 kg/Liter"),
            ("Net Delivered Mass", "1,609.94 kg"),
            ("Lower Heating Value (NCV)", "40.40 MJ/kg"),
            ("Fuel Emission Reference", "IPCC 2006 Guidelines for Stationary Combustion in Manufacturing"),
            ("Combustion Emission Factor", "3.114 kg CO2e / Liter")
        ],
        "notes": "Fuel consumed in rolling mill reheating furnace during Q1 2026 export production."
    })

    # 5. Supplier DRI Precursor Certificate
    docs.append({
        "filename": "Deccan_Sponge_DRI_Emissions_Cert.pdf",
        "title": "DECCAN SPONGE IRON & POWER LIMITED",
        "subtitle": "Upstream Supplier Specific Carbon Emissions Certificate | Doc Ref: DSI-CBAM-2026-09",
        "rows": [
            ("Supplier Name & Facility", "Deccan Sponge Iron & Power Ltd, Bellary-Hospet Complex, Karnataka"),
            ("Supplied MSME Customer", "Apex Forgings & Steel Products Pvt Ltd, Ludhiana"),
            ("Precursor Raw Material", "Direct Reduced Iron (DRI / Sponge Iron Pellets Grade A)"),
            ("Total Quantity Dispatched", "52.55 Metric Tons (MT)"),
            ("Supplier Production Process", "Coal-based Rotary Kiln with Waste Heat Recovery Power"),
            ("Certified Precursor Specific Intensity", "1.9200 tCO2e / MT DRI"),
            ("Verification Body", "Bureau Veritas Green Audit Services India Pvt Ltd"),
            ("CBAM EU Guidance Annex", "Annex IV Section 3 - Embedded Emissions in Complex Goods Precursors")
        ],
        "notes": "Primary upstream supplier carbon data provided in accordance with EU CBAM communication requirements."
    })

    files = []
    for d in docs:
        fp = build_pdf(d["filename"], d["title"], d["subtitle"], d["rows"], d["notes"])
        files.append((d["filename"], fp))
    return files

if __name__ == "__main__":
    generate_all_sample_docs()

