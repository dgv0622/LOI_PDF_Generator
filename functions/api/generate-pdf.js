import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Generate a professional Letter of Intent PDF from form data
 * Cloudflare Pages Function
 */
export async function onRequestPost(context) {
  try {
    const formData = await context.request.json();

    // Generate PDF
    const pdfBytes = await generateLoiPdf(formData);

    // Create filename based on date
    const dateStr = formData.date ? formData.date.replace(/-/g, '_') : 'document';
    const filename = `Letter_of_Intent_${dateStr}.pdf`;

    // Return PDF as response
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: `Failed to generate PDF: ${error.message}` }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * Handle CORS preflight requests
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Generate LOI PDF using pdf-lib
 */
async function generateLoiPdf(formData) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesBold);

  // Add a page
  let page = pdfDoc.addPage([612, 792]); // Letter size: 8.5" x 11" = 612 x 792 points
  const { width, height } = page.getSize();

  // Margins (1 inch = 72 points)
  const margin = 72;
  const contentWidth = width - 2 * margin;
  let yPosition = height - margin;

  // Helper function to get value or placeholder
  const getValue = (key, placeholder = '[Not Provided]') => {
    const value = formData[key]?.toString().trim();
    return value || placeholder;
  };

  // Helper function to add text with wrapping
  const addText = (text, fontSize, font, options = {}) => {
    const lineHeight = options.lineHeight || fontSize * 1.4;
    const maxWidth = options.maxWidth || contentWidth;
    const align = options.align || 'left';
    const bold = options.bold || false;
    const textFont = bold ? timesBoldFont : font;

    // Split text into lines that fit within maxWidth
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = textFont.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Check if we need a new page
    const totalHeight = lines.length * lineHeight;
    if (yPosition - totalHeight < margin) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = height - margin;
    }

    // Draw each line
    for (const line of lines) {
      let xPosition = margin;
      if (align === 'center') {
        const textWidth = textFont.widthOfTextAtSize(line, fontSize);
        xPosition = (width - textWidth) / 2;
      }

      page.drawText(line, {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        font: textFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }

    return yPosition;
  };

  // Helper function to add spacing
  const addSpace = (inches) => {
    yPosition -= inches * 72;
    // Check if we need a new page
    if (yPosition < margin) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = height - margin;
    }
  };

  // Title
  yPosition = addText(
    'Letter of Intent to Purchase Real Property',
    16,
    timesBoldFont,
    { align: 'center', bold: true }
  );
  addSpace(0.2);

  // Date
  yPosition = addText(getValue('date', '[Date]'), 11, timesRomanFont);
  addSpace(0.2);

  // To: Section
  const sellerName = getValue('sellerName', "[Seller's Name]");
  const sellerCompany = formData.sellerCompany ? getValue('sellerCompany') : '';
  const sellerAddress = getValue('sellerAddress', "[Seller's Address]");
  let toText = `To: ${sellerName}`;
  if (sellerCompany) toText += ` ${sellerCompany}`;
  toText += ` ${sellerAddress}`;
  yPosition = addText(toText, 11, timesRomanFont);
  addSpace(0.2);

  // From: Section
  const buyerName = getValue('buyerName', "[Buyer's Name / Entity]");
  const buyerAddress = getValue('buyerAddress', "[Buyer's Address]");
  const fromText = `From: ${buyerName} ${buyerAddress}`;
  yPosition = addText(fromText, 11, timesRomanFont);
  addSpace(0.2);

  // Re: Section
  const propertyRef = formData.propertyName
    ? getValue('propertyName')
    : getValue('propertyAddress', '[Property Name or Address]');
  const reText = `Re: Letter of Intent to Purchase ${propertyRef}`;
  yPosition = addText(reText, 11, timesRomanFont);
  addSpace(0.3);

  // 1. Introduction
  yPosition = addText('1. Introduction', 12, timesBoldFont, { bold: true });
  const buyerEntity = getValue('buyerName', '[Buyer Name / Entity]');
  const propertyAddr = getValue('propertyAddress', '[Property Address]');
  const sellerEntity = getValue('sellerName', '[Seller Name]');
  const introText = `This Letter of Intent ("LOI") sets forth the general terms and conditions under which ${buyerEntity} ("Buyer") proposes to purchase the property commonly known as ${propertyAddr} (the "Property") from ${sellerEntity} ("Seller"). The terms below are intended solely as a basis for further negotiation and are not intended to be binding upon either party except as specifically noted.`;
  yPosition = addText(introText, 11, timesRomanFont);
  addSpace(0.1);

  // 2. Property Description
  yPosition = addText('2. Property Description', 12, timesBoldFont, { bold: true });
  const propDescText = `The Property consists of ${getValue('propertyDescription', '[# units / square footage / acreage]')}, identified as ${getValue('propertyType', '[Property Type: multifamily, retail, mixed-use, etc.]')}, and located at ${getValue('propertyAddress', '[full legal address, city, state, ZIP]')}.`;
  yPosition = addText(propDescText, 11, timesRomanFont);
  addSpace(0.1);

  // 3. Proposed Purchase Price
  yPosition = addText('3. Proposed Purchase Price', 12, timesBoldFont, { bold: true });
  const priceText = `Buyer proposes to purchase the Property for a total price of $${getValue('purchasePrice', '[Offer Amount]')}, payable in U.S. dollars, subject to adjustments and prorations customary for transactions of this nature. The acquisition shall be ${getValue('acquisitionType', '[all cash / financed]')}.`;
  yPosition = addText(priceText, 11, timesRomanFont);
  addSpace(0.1);

  // 4. Earnest Money Deposit
  yPosition = addText('4. Earnest Money Deposit', 12, timesBoldFont, { bold: true });
  const depositText = `Upon execution of a mutually acceptable Purchase and Sale Agreement ("PSA"), Buyer shall deposit $${getValue('depositAmount', '[Deposit Amount]')} into escrow with ${getValue('escrowAgent', '[Escrow Agent or Title Company]')} within ${getValue('depositDays', '[X]')} business days. The deposit shall be refundable during the Due Diligence Period and non-refundable thereafter, except in the event of Seller default or failure of stated contingencies.`;
  yPosition = addText(depositText, 11, timesRomanFont);
  addSpace(0.1);

  // 5. Due Diligence Period
  yPosition = addText('5. Due Diligence Period', 12, timesBoldFont, { bold: true });
  const ddText = `Buyer shall have ${getValue('dueDiligenceDays', '[X]')} calendar days from the effective date of the PSA to conduct inspections, review financials, and perform all due diligence, including but not limited to title, survey, zoning, and environmental matters.`;
  yPosition = addText(ddText, 11, timesRomanFont);
  addSpace(0.1);

  // 6. Closing
  yPosition = addText('6. Closing', 12, timesBoldFont, { bold: true });
  const closingText = `Closing shall occur within ${getValue('closingDays', '[X]')} days following the expiration of the Due Diligence Period, or as otherwise agreed in the PSA.`;
  yPosition = addText(closingText, 11, timesRomanFont);
  addSpace(0.1);

  // 7. Financing
  yPosition = addText('7. Financing', 12, timesBoldFont, { bold: true });
  let financingText = `This proposal ${getValue('financingContingent', '[is / is not]')} contingent upon Buyer obtaining financing.`;
  if (formData.financingType) {
    financingText += ` If applicable, Buyer anticipates utilizing ${getValue('financingType')} financing.`;
  }
  yPosition = addText(financingText, 11, timesRomanFont);
  addSpace(0.1);

  // 8. Contingencies
  yPosition = addText('8. Contingencies', 12, timesBoldFont, { bold: true });
  let contingenciesText = 'This proposal is subject to the following contingencies, to be detailed in the PSA: Approval of Buyer\'s due diligence findings; Acceptable title and survey; Satisfactory appraisal (if financed); Environmental review (if applicable)';
  if (formData.contingencies) {
    contingenciesText += `; ${getValue('contingencies')}`;
  }
  yPosition = addText(contingenciesText, 11, timesRomanFont);
  addSpace(0.1);

  // 9. Access and Cooperation
  yPosition = addText('9. Access and Cooperation', 12, timesBoldFont, { bold: true });
  const accessText = 'Upon mutual execution of this LOI, Seller agrees to provide Buyer and its representatives reasonable access to the Property and operating information necessary for Buyer\'s evaluation.';
  yPosition = addText(accessText, 11, timesRomanFont);
  addSpace(0.1);

  // 10. Broker Disclosure
  yPosition = addText('10. Broker Disclosure', 12, timesBoldFont, { bold: true });
  let brokerText = 'The parties acknowledge that the following brokers are involved in this transaction: ';

  let buyerBroker = getValue('buyerBroker', '[Name]');
  if (formData.buyerBrokerFirm) buyerBroker += `, ${getValue('buyerBrokerFirm')}`;
  if (formData.buyerBrokerLicense) buyerBroker += `, License #${getValue('buyerBrokerLicense')}`;
  brokerText += `Buyer's Broker: ${buyerBroker}. `;

  let sellerBroker = getValue('sellerBroker', '[Name]');
  if (formData.sellerBrokerFirm) sellerBroker += `, ${getValue('sellerBrokerFirm')}`;
  if (formData.sellerBrokerLicense) sellerBroker += `, License #${getValue('sellerBrokerLicense')}`;
  brokerText += `Seller's Broker: ${sellerBroker}. `;
  brokerText += 'Each party shall be responsible for any commissions owed to their respective brokers.';
  yPosition = addText(brokerText, 11, timesRomanFont);
  addSpace(0.1);

  // 11. Confidentiality
  yPosition = addText('11. Confidentiality', 12, timesBoldFont, { bold: true });
  const confidentialityText = 'Both parties agree to maintain confidentiality regarding the terms and discussions of this proposed transaction and not to disclose information to outside parties except as required by law or in connection with financing or due diligence.';
  yPosition = addText(confidentialityText, 11, timesRomanFont);
  addSpace(0.1);

  // 12. Expiration
  yPosition = addText('12. Expiration', 12, timesBoldFont, { bold: true });
  const expirationText = `This LOI shall expire if not executed by both parties by ${getValue('expirationDate', '[Date/Time]')}, after which it shall be considered withdrawn.`;
  yPosition = addText(expirationText, 11, timesRomanFont);
  addSpace(0.1);

  // 13. Non-Binding Effect
  yPosition = addText('13. Non-Binding Effect', 12, timesBoldFont, { bold: true });
  const nonBindingText = 'This LOI is intended solely as an outline for negotiation and does not constitute a binding contract to buy or sell the Property. The only provisions intended to be binding are those relating to confidentiality (Section 11) and broker disclosure (Section 10). A binding obligation will arise only upon execution of a mutually agreed Purchase and Sale Agreement.';
  yPosition = addText(nonBindingText, 11, timesRomanFont);
  addSpace(0.4);

  // Signature Section - Buyer
  yPosition = addText('Sincerely,', 11, timesRomanFont);
  addSpace(0.3);

  const buyerNameSig = getValue('buyerName', "[Buyer's Name / Entity]");
  const buyerAuth = getValue('buyerAuthorizedSigner', '[Authorized Signer]');
  const buyerTitleSig = getValue('buyerTitle', '[Title if applicable]');
  const dateSig = getValue('date', '[Insert Date]');

  yPosition = addText(buyerNameSig, 11, timesBoldFont, { bold: true });
  addSpace(0.2);
  yPosition = addText('By: ___________________________', 11, timesRomanFont);
  yPosition = addText(`Name: ${buyerAuth}`, 11, timesRomanFont);
  yPosition = addText(`Title: ${buyerTitleSig}`, 11, timesRomanFont);
  yPosition = addText(`Date: ${dateSig}`, 11, timesRomanFont);
  addSpace(0.4);

  // Signature Section - Seller
  yPosition = addText('Acknowledged and Agreed:', 11, timesBoldFont, { bold: true });
  addSpace(0.1);

  const sellerNameSig = getValue('sellerName', "[Seller's Name / Entity]");
  const sellerAuth = getValue('sellerAuthorizedSigner', '[Authorized Signer]');
  const sellerTitleSig = getValue('sellerTitle', '[Title if applicable]');

  yPosition = addText(sellerNameSig, 11, timesBoldFont, { bold: true });
  addSpace(0.2);
  yPosition = addText('By: ___________________________', 11, timesRomanFont);
  yPosition = addText(`Name: ${sellerAuth}`, 11, timesRomanFont);
  yPosition = addText(`Title: ${sellerTitleSig}`, 11, timesRomanFont);
  yPosition = addText(`Date: ${dateSig}`, 11, timesRomanFont);

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
