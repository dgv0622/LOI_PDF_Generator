from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime


def generate_loi_pdf(form_data: dict) -> bytes:
    """
    Generate a professional Letter of Intent PDF from form data.
    
    Args:
        form_data: Dictionary containing all form fields
        
    Returns:
        PDF as bytes
    """
    buffer = BytesIO()
    
    # Create the PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles for legal document
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor='black',
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Times-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor='black',
        spaceAfter=12,
        spaceBefore=12,
        fontName='Times-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        textColor='black',
        alignment=TA_JUSTIFY,
        spaceAfter=12,
        fontName='Times-Roman',
        leading=16
    )
    
    # Helper function to get value or placeholder
    def get_value(key, placeholder='[Not Provided]'):
        value = form_data.get(key, '').strip()
        return value if value else placeholder
    
    # Title
    elements.append(Paragraph("Letter of Intent to Purchase Real Property", title_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # Date
    elements.append(Paragraph(get_value('date', '[Date]'), body_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # To: Section
    seller_name = get_value('sellerName', "[Seller's Name]")
    seller_address = get_value('sellerAddress', "[Seller's Address]")
    to_text = f"<b>To:</b><br/>{seller_name}"
    if form_data.get('sellerCompany'):
        to_text += f"<br/>{get_value('sellerCompany')}"
    to_text += f"<br/>{seller_address}"
    elements.append(Paragraph(to_text, body_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # From: Section
    buyer_name = get_value('buyerName', "[Buyer's Name / Entity]")
    buyer_address = get_value('buyerAddress', "[Buyer's Address]")
    from_text = f"<b>From:</b><br/>{buyer_name}<br/>{buyer_address}"
    elements.append(Paragraph(from_text, body_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # Re: Section
    property_ref = get_value('propertyName') if form_data.get('propertyName') else get_value('propertyAddress', '[Property Name or Address]')
    re_text = f"<b>Re:</b> Letter of Intent to Purchase {property_ref}"
    elements.append(Paragraph(re_text, body_style))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 1. Introduction
    elements.append(Paragraph("1. Introduction", heading_style))
    buyer_entity = get_value('buyerName', '[Buyer Name / Entity]')
    property_addr = get_value('propertyAddress', '[Property Address]')
    seller_entity = get_value('sellerName', '[Seller Name]')
    intro_text = f"""This Letter of Intent ("LOI") sets forth the general terms and conditions under which 
    {buyer_entity} ("Buyer") proposes to purchase the property commonly known as 
    {property_addr} (the "Property") from {seller_entity} 
    ("Seller"). The terms below are intended solely as a basis for further negotiation and are not intended to be 
    binding upon either party except as specifically noted."""
    elements.append(Paragraph(intro_text, body_style))
    
    # 2. Property Description
    elements.append(Paragraph("2. Property Description", heading_style))
    prop_desc_text = f"""The Property consists of {get_value('propertyDescription', '[# units / square footage / acreage]')}, 
    identified as {get_value('propertyType', '[Property Type: multifamily, retail, mixed-use, etc.]')}, and located at 
    {get_value('propertyAddress', '[full legal address, city, state, ZIP]')}."""
    elements.append(Paragraph(prop_desc_text, body_style))
    
    # 3. Proposed Purchase Price
    elements.append(Paragraph("3. Proposed Purchase Price", heading_style))
    price_text = f"""Buyer proposes to purchase the Property for a total price of ${get_value('purchasePrice', '[Offer Amount]')}, 
    payable in U.S. dollars, subject to adjustments and prorations customary for transactions of this nature. 
    The acquisition shall be {get_value('acquisitionType', '[all cash / financed]')}."""
    elements.append(Paragraph(price_text, body_style))
    
    # 4. Earnest Money Deposit
    elements.append(Paragraph("4. Earnest Money Deposit", heading_style))
    deposit_text = f"""Upon execution of a mutually acceptable Purchase and Sale Agreement ("PSA"), Buyer shall deposit 
    ${get_value('depositAmount', '[Deposit Amount]')} into escrow with {get_value('escrowAgent', '[Escrow Agent or Title Company]')} 
    within {get_value('depositDays', '[X]')} business days. The deposit shall be refundable during the Due Diligence Period 
    and non-refundable thereafter, except in the event of Seller default or failure of stated contingencies."""
    elements.append(Paragraph(deposit_text, body_style))
    
    # 5. Due Diligence Period
    elements.append(Paragraph("5. Due Diligence Period", heading_style))
    dd_text = f"""Buyer shall have {get_value('dueDiligenceDays', '[X]')} calendar days from the effective date of the PSA 
    to conduct inspections, review financials, and perform all due diligence, including but not limited to title, survey, 
    zoning, and environmental matters."""
    elements.append(Paragraph(dd_text, body_style))
    
    # 6. Closing
    elements.append(Paragraph("6. Closing", heading_style))
    closing_text = f"""Closing shall occur within {get_value('closingDays', '[X]')} days following the expiration of the 
    Due Diligence Period, or as otherwise agreed in the PSA."""
    elements.append(Paragraph(closing_text, body_style))
    
    # 7. Financing
    elements.append(Paragraph("7. Financing", heading_style))
    financing_text = f"""This proposal {get_value('financingContingent', '[is / is not]')} contingent upon Buyer obtaining financing."""
    if form_data.get('financingType'):
        financing_text += f" If applicable, Buyer anticipates utilizing {get_value('financingType')} financing."
    elements.append(Paragraph(financing_text, body_style))
    
    # 8. Contingencies
    elements.append(Paragraph("8. Contingencies", heading_style))
    contingencies_intro = """This proposal is subject to the following contingencies, to be detailed in the PSA:<br/>
    • Approval of Buyer's due diligence findings<br/>
    • Acceptable title and survey<br/>
    • Satisfactory appraisal (if financed)<br/>
    • Environmental review (if applicable)"""
    if form_data.get('contingencies'):
        contingencies_intro += f"<br/>• {get_value('contingencies')}"
    elements.append(Paragraph(contingencies_intro, body_style))
    
    # 9. Access and Cooperation
    elements.append(Paragraph("9. Access and Cooperation", heading_style))
    access_text = """Upon mutual execution of this LOI, Seller agrees to provide Buyer and its representatives reasonable 
    access to the Property and operating information necessary for Buyer's evaluation."""
    elements.append(Paragraph(access_text, body_style))
    
    # 10. Broker Disclosure
    elements.append(Paragraph("10. Broker Disclosure", heading_style))
    broker_text = "The parties acknowledge that the following brokers are involved in this transaction:<br/>"
    
    buyer_broker = get_value('buyerBroker', '[Name]')
    if form_data.get('buyerBrokerFirm'):
        buyer_broker += f", {get_value('buyerBrokerFirm')}"
    if form_data.get('buyerBrokerLicense'):
        buyer_broker += f", License #{get_value('buyerBrokerLicense')}"
    broker_text += f"Buyer's Broker: {buyer_broker}<br/>"
    
    seller_broker = get_value('sellerBroker', '[Name]')
    if form_data.get('sellerBrokerFirm'):
        seller_broker += f", {get_value('sellerBrokerFirm')}"
    if form_data.get('sellerBrokerLicense'):
        seller_broker += f", License #{get_value('sellerBrokerLicense')}"
    broker_text += f"Seller's Broker: {seller_broker}<br/><br/>"
    broker_text += "Each party shall be responsible for any commissions owed to their respective brokers."
    elements.append(Paragraph(broker_text, body_style))
    
    # 11. Confidentiality
    elements.append(Paragraph("11. Confidentiality", heading_style))
    confidentiality_text = """Both parties agree to maintain confidentiality regarding the terms and discussions of this 
    proposed transaction and not to disclose information to outside parties except as required by law or in connection 
    with financing or due diligence."""
    elements.append(Paragraph(confidentiality_text, body_style))
    
    # 12. Expiration
    elements.append(Paragraph("12. Expiration", heading_style))
    expiration_text = f"""This LOI shall expire if not executed by both parties by {get_value('expirationDate', '[Date/Time]')}, 
    after which it shall be considered withdrawn."""
    elements.append(Paragraph(expiration_text, body_style))
    
    # 13. Non-Binding Effect
    elements.append(Paragraph("13. Non-Binding Effect", heading_style))
    non_binding_text = """This LOI is intended solely as an outline for negotiation and does not constitute a binding 
    contract to buy or sell the Property. The only provisions intended to be binding are those relating to confidentiality 
    (Section 11) and broker disclosure (Section 10). A binding obligation will arise only upon execution of a mutually 
    agreed Purchase and Sale Agreement."""
    elements.append(Paragraph(non_binding_text, body_style))
    
    elements.append(Spacer(1, 0.4 * inch))
    
    # Signature Section - Buyer
    elements.append(Paragraph("Sincerely,", body_style))
    elements.append(Spacer(1, 0.3 * inch))
    
    buyer_name_sig = get_value('buyerName', "[Buyer's Name / Entity]")
    buyer_auth = get_value('buyerAuthorizedSigner', '[Authorized Signer]')
    buyer_title_sig = get_value('buyerTitle', '[Title if applicable]')
    date_sig = get_value('date', '[Insert Date]')
    buyer_sig = f"""<b>{buyer_name_sig}</b><br/><br/>
    By: ___________________________<br/>
    Name: {buyer_auth}<br/>
    Title: {buyer_title_sig}<br/>
    Date: {date_sig}"""
    elements.append(Paragraph(buyer_sig, body_style))
    
    elements.append(Spacer(1, 0.4 * inch))
    
    # Signature Section - Seller
    elements.append(Paragraph("<b>Acknowledged and Agreed:</b>", body_style))
    elements.append(Spacer(1, 0.1 * inch))
    
    seller_name_sig = get_value('sellerName', "[Seller's Name / Entity]")
    seller_auth = get_value('sellerAuthorizedSigner', '[Authorized Signer]')
    seller_title_sig = get_value('sellerTitle', '[Title if applicable]')
    seller_sig = f"""<b>{seller_name_sig}</b><br/><br/>
    By: ___________________________<br/>
    Name: {seller_auth}<br/>
    Title: {seller_title_sig}<br/>
    Date: {date_sig}"""
    elements.append(Paragraph(seller_sig, body_style))
    
    # Build PDF
    doc.build(elements)
    
    # Get the PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
