import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { FileDown, Eye } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const LOIForm = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    sellerName: '',
    sellerCompany: '',
    sellerAddress: '',
    buyerName: '',
    buyerAddress: '',
    propertyName: '',
    propertyAddress: '',
    propertyDescription: '',
    propertyType: '',
    purchasePrice: '',
    acquisitionType: '',
    depositAmount: '',
    escrowAgent: '',
    depositDays: '',
    dueDiligenceDays: '',
    closingDays: '',
    financingContingent: '',
    financingType: '',
    contingencies: '',
    buyerBroker: '',
    buyerBrokerFirm: '',
    buyerBrokerLicense: '',
    sellerBroker: '',
    sellerBrokerFirm: '',
    sellerBrokerLicense: '',
    expirationDate: '',
    buyerAuthorizedSigner: '',
    buyerTitle: '',
    sellerAuthorizedSigner: '',
    sellerTitle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = () => {
    // Validate required fields
    const requiredFields = ['date', 'sellerName', 'buyerName', 'propertyAddress', 'purchasePrice'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    // This will be implemented with actual PDF generation
    toast({
      title: "PDF Generation",
      description: "PDF download functionality will be implemented in backend integration",
    });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Document Preview</h2>
          <div className="flex gap-3">
            <Button onClick={togglePreview} variant="outline">
              Back to Edit
            </Button>
            <Button onClick={handleDownloadPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        <div className="bg-white text-black p-12 shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-8">Letter of Intent to Purchase Real Property</h1>
            
            <p>{formData.date || '[Date]'}</p>
            
            <div>
              <p className="font-semibold">To:</p>
              <p>{formData.sellerName || '[Seller\'s Name]'}</p>
              {formData.sellerCompany && <p>{formData.sellerCompany}</p>}
              <p>{formData.sellerAddress || '[Seller\'s Address]'}</p>
            </div>

            <div>
              <p className="font-semibold">From:</p>
              <p>{formData.buyerName || '[Buyer\'s Name / Entity]'}</p>
              <p>{formData.buyerAddress || '[Buyer\'s Address]'}</p>
            </div>

            <p><strong>Re:</strong> Letter of Intent to Purchase {formData.propertyName || formData.propertyAddress || '[Property Name or Address]'}</p>

            <Separator className="my-6" />

            <div>
              <h3 className="font-bold text-lg mb-2">1. Introduction</h3>
              <p className="text-justify leading-relaxed">
                This Letter of Intent ("LOI") sets forth the general terms and conditions under which {formData.buyerName || '[Buyer Name / Entity]'} ("Buyer") proposes to purchase the property commonly known as {formData.propertyAddress || '[Property Address]'} (the "Property") from {formData.sellerName || '[Seller Name]'} ("Seller"). The terms below are intended solely as a basis for further negotiation and are not intended to be binding upon either party except as specifically noted.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">2. Property Description</h3>
              <p className="text-justify leading-relaxed">
                The Property consists of {formData.propertyDescription || '[# units / square footage / acreage]'}, identified as {formData.propertyType || '[Property Type: multifamily, retail, mixed-use, etc.]'}, and located at {formData.propertyAddress || '[full legal address, city, state, ZIP]'}.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">3. Proposed Purchase Price</h3>
              <p className="text-justify leading-relaxed">
                Buyer proposes to purchase the Property for a total price of ${formData.purchasePrice || '[Offer Amount]'}, payable in U.S. dollars, subject to adjustments and prorations customary for transactions of this nature. The acquisition shall be {formData.acquisitionType || '[all cash / financed]'}.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">4. Earnest Money Deposit</h3>
              <p className="text-justify leading-relaxed">
                Upon execution of a mutually acceptable Purchase and Sale Agreement ("PSA"), Buyer shall deposit ${formData.depositAmount || '[Deposit Amount]'} into escrow with {formData.escrowAgent || '[Escrow Agent or Title Company]'} within {formData.depositDays || '[X]'} business days. The deposit shall be refundable during the Due Diligence Period and non-refundable thereafter, except in the event of Seller default or failure of stated contingencies.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">5. Due Diligence Period</h3>
              <p className="text-justify leading-relaxed">
                Buyer shall have {formData.dueDiligenceDays || '[X]'} calendar days from the effective date of the PSA to conduct inspections, review financials, and perform all due diligence, including but not limited to title, survey, zoning, and environmental matters.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">6. Closing</h3>
              <p className="text-justify leading-relaxed">
                Closing shall occur within {formData.closingDays || '[X]'} days following the expiration of the Due Diligence Period, or as otherwise agreed in the PSA.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">7. Financing</h3>
              <p className="text-justify leading-relaxed">
                This proposal {formData.financingContingent || '[is / is not]'} contingent upon Buyer obtaining financing.
                {formData.financingType && ` If applicable, Buyer anticipates utilizing ${formData.financingType} financing.`}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">8. Contingencies</h3>
              <p className="text-justify leading-relaxed mb-2">
                This proposal is subject to the following contingencies, to be detailed in the PSA:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Approval of Buyer's due diligence findings</li>
                <li>Acceptable title and survey</li>
                <li>Satisfactory appraisal (if financed)</li>
                <li>Environmental review (if applicable)</li>
                {formData.contingencies && <li>{formData.contingencies}</li>}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">9. Access and Cooperation</h3>
              <p className="text-justify leading-relaxed">
                Upon mutual execution of this LOI, Seller agrees to provide Buyer and its representatives reasonable access to the Property and operating information necessary for Buyer's evaluation.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">10. Broker Disclosure</h3>
              <p className="text-justify leading-relaxed mb-2">
                The parties acknowledge that the following brokers are involved in this transaction:
              </p>
              <p>Buyer's Broker: {formData.buyerBroker || '[Name]'}{formData.buyerBrokerFirm ? `, ${formData.buyerBrokerFirm}` : ''}{formData.buyerBrokerLicense ? `, License #${formData.buyerBrokerLicense}` : ''}</p>
              <p>Seller's Broker: {formData.sellerBroker || '[Name]'}{formData.sellerBrokerFirm ? `, ${formData.sellerBrokerFirm}` : ''}{formData.sellerBrokerLicense ? `, License #${formData.sellerBrokerLicense}` : ''}</p>
              <p className="mt-2">Each party shall be responsible for any commissions owed to their respective brokers.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">11. Confidentiality</h3>
              <p className="text-justify leading-relaxed">
                Both parties agree to maintain confidentiality regarding the terms and discussions of this proposed transaction and not to disclose information to outside parties except as required by law or in connection with financing or due diligence.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">12. Expiration</h3>
              <p className="text-justify leading-relaxed">
                This LOI shall expire if not executed by both parties by {formData.expirationDate || '[Date/Time]'}, after which it shall be considered withdrawn.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">13. Non-Binding Effect</h3>
              <p className="text-justify leading-relaxed">
                This LOI is intended solely as an outline for negotiation and does not constitute a binding contract to buy or sell the Property. The only provisions intended to be binding are those relating to confidentiality (Section 11) and broker disclosure (Section 10). A binding obligation will arise only upon execution of a mutually agreed Purchase and Sale Agreement.
              </p>
            </div>

            <div className="mt-12">
              <p className="mb-8">Sincerely,</p>
              <p className="font-semibold">{formData.buyerName || '[Buyer\'s Name / Entity]'}</p>
              <p className="mt-4">By: ___________________________</p>
              <p>Name: {formData.buyerAuthorizedSigner || '[Authorized Signer]'}</p>
              <p>Title: {formData.buyerTitle || '[Title if applicable]'}</p>
              <p>Date: {formData.date || '[Insert Date]'}</p>
            </div>

            <div className="mt-12">
              <p className="font-semibold mb-2">Acknowledged and Agreed:</p>
              <p className="font-semibold">{formData.sellerName || '[Seller\'s Name / Entity]'}</p>
              <p className="mt-4">By: ___________________________</p>
              <p>Name: {formData.sellerAuthorizedSigner || '[Authorized Signer]'}</p>
              <p>Title: {formData.sellerTitle || '[Title if applicable]'}</p>
              <p>Date: {formData.date || '[Insert Date]'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Letter of Intent - Real Property Purchase</h1>
        <p className="text-muted-foreground">Complete the form below to generate your Letter of Intent document</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Document Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Information */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sellerName">Seller's Name *</Label>
                <Input
                  id="sellerName"
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sellerCompany">Seller's Company (Optional)</Label>
                <Input
                  id="sellerCompany"
                  name="sellerCompany"
                  value={formData.sellerCompany}
                  onChange={handleChange}
                  placeholder="ABC Properties LLC"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="sellerAddress">Seller's Address</Label>
                <Input
                  id="sellerAddress"
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="buyerName">Buyer's Name / Entity *</Label>
                <Input
                  id="buyerName"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  placeholder="Jane Smith or XYZ Investments LLC"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="buyerAddress">Buyer's Address</Label>
                <Input
                  id="buyerAddress"
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleChange}
                  placeholder="456 Oak Ave, City, State ZIP"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyName">Property Name (Optional)</Label>
                <Input
                  id="propertyName"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="Sunset Apartments"
                />
              </div>
              <div>
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  placeholder="789 Property Ln, City, State ZIP"
                  required
                />
              </div>
              <div>
                <Label htmlFor="propertyDescription">Property Description</Label>
                <Input
                  id="propertyDescription"
                  name="propertyDescription"
                  value={formData.propertyDescription}
                  onChange={handleChange}
                  placeholder="24 units / 15,000 square feet / 5 acres"
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Input
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  placeholder="Multifamily, retail, mixed-use, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price (USD) *</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="1,500,000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="acquisitionType">Acquisition Type</Label>
                <Input
                  id="acquisitionType"
                  name="acquisitionType"
                  value={formData.acquisitionType}
                  onChange={handleChange}
                  placeholder="all cash / financed"
                />
              </div>
              <div>
                <Label htmlFor="depositAmount">Earnest Money Deposit (USD)</Label>
                <Input
                  id="depositAmount"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleChange}
                  placeholder="50,000"
                />
              </div>
              <div>
                <Label htmlFor="escrowAgent">Escrow Agent / Title Company</Label>
                <Input
                  id="escrowAgent"
                  name="escrowAgent"
                  value={formData.escrowAgent}
                  onChange={handleChange}
                  placeholder="First American Title"
                />
              </div>
              <div>
                <Label htmlFor="depositDays">Deposit Due (Business Days)</Label>
                <Input
                  id="depositDays"
                  name="depositDays"
                  value={formData.depositDays}
                  onChange={handleChange}
                  placeholder="5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDiligenceDays">Due Diligence Period (Calendar Days)</Label>
                <Input
                  id="dueDiligenceDays"
                  name="dueDiligenceDays"
                  value={formData.dueDiligenceDays}
                  onChange={handleChange}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="closingDays">Closing Period (Days)</Label>
                <Input
                  id="closingDays"
                  name="closingDays"
                  value={formData.closingDays}
                  onChange={handleChange}
                  placeholder="45"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="expirationDate">LOI Expiration Date</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="datetime-local"
                  value={formData.expirationDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financing */}
        <Card>
          <CardHeader>
            <CardTitle>Financing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="financingContingent">Financing Contingent?</Label>
                <Input
                  id="financingContingent"
                  name="financingContingent"
                  value={formData.financingContingent}
                  onChange={handleChange}
                  placeholder="is / is not"
                />
              </div>
              <div>
                <Label htmlFor="financingType">Type of Financing (if applicable)</Label>
                <Input
                  id="financingType"
                  name="financingType"
                  value={formData.financingType}
                  onChange={handleChange}
                  placeholder="bank, bridge, private, SBA, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Contingencies */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Contingencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="contingencies">Additional Contingencies (Optional)</Label>
              <Textarea
                id="contingencies"
                name="contingencies"
                value={formData.contingencies}
                onChange={handleChange}
                placeholder="Any additional contingencies beyond the standard items..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Broker Information */}
        <Card>
          <CardHeader>
            <CardTitle>Broker Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Buyer's Broker</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="buyerBroker">Name</Label>
                    <Input
                      id="buyerBroker"
                      name="buyerBroker"
                      value={formData.buyerBroker}
                      onChange={handleChange}
                      placeholder="Broker Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerBrokerFirm">Firm</Label>
                    <Input
                      id="buyerBrokerFirm"
                      name="buyerBrokerFirm"
                      value={formData.buyerBrokerFirm}
                      onChange={handleChange}
                      placeholder="Brokerage Firm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerBrokerLicense">License #</Label>
                    <Input
                      id="buyerBrokerLicense"
                      name="buyerBrokerLicense"
                      value={formData.buyerBrokerLicense}
                      onChange={handleChange}
                      placeholder="License Number"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Seller's Broker</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sellerBroker">Name</Label>
                    <Input
                      id="sellerBroker"
                      name="sellerBroker"
                      value={formData.sellerBroker}
                      onChange={handleChange}
                      placeholder="Broker Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerBrokerFirm">Firm</Label>
                    <Input
                      id="sellerBrokerFirm"
                      name="sellerBrokerFirm"
                      value={formData.sellerBrokerFirm}
                      onChange={handleChange}
                      placeholder="Brokerage Firm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerBrokerLicense">License #</Label>
                    <Input
                      id="sellerBrokerLicense"
                      name="sellerBrokerLicense"
                      value={formData.sellerBrokerLicense}
                      onChange={handleChange}
                      placeholder="License Number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Signature Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Buyer's Authorized Signer</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buyerAuthorizedSigner">Name</Label>
                    <Input
                      id="buyerAuthorizedSigner"
                      name="buyerAuthorizedSigner"
                      value={formData.buyerAuthorizedSigner}
                      onChange={handleChange}
                      placeholder="Authorized Signer Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerTitle">Title</Label>
                    <Input
                      id="buyerTitle"
                      name="buyerTitle"
                      value={formData.buyerTitle}
                      onChange={handleChange}
                      placeholder="CEO, Managing Partner, etc."
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Seller's Authorized Signer</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sellerAuthorizedSigner">Name</Label>
                    <Input
                      id="sellerAuthorizedSigner"
                      name="sellerAuthorizedSigner"
                      value={formData.sellerAuthorizedSigner}
                      onChange={handleChange}
                      placeholder="Authorized Signer Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerTitle">Title</Label>
                    <Input
                      id="sellerTitle"
                      name="sellerTitle"
                      value={formData.sellerTitle}
                      onChange={handleChange}
                      placeholder="Owner, President, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button onClick={togglePreview} size="lg" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Document
          </Button>
          <Button onClick={handleDownloadPDF} size="lg">
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LOIForm;