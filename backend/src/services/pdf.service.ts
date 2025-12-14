import PDFDocument from 'pdfkit';
import { Response } from 'express';

export function streamPdf(res: Response, buildFn: (doc: PDFKit.PDFDocument) => void) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');

  doc.pipe(res);
  buildFn(doc);
  doc.end();
}

export function generateCertificatePdf(doc: PDFKit.PDFDocument, data: { userName: string; courseName: string; date: Date }) {
  // Border
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

  // Header
  doc.fontSize(30).font('Helvetica-Bold').text('CERTIFICATE OF COMPLETION', { align: 'center' });
  doc.moveDown();
  
  // Body
  doc.fontSize(20).font('Helvetica').text('This is to certify that', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(25).font('Helvetica-Bold').text(data.userName, { align: 'center', underline: true });
  doc.moveDown();
  
  doc.fontSize(20).font('Helvetica').text('Has successfully completed the roadmap', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(25).font('Helvetica-Bold').text(data.courseName, { align: 'center' });
  doc.moveDown(2);
  
  // Footer
  doc.fontSize(15).text(`Date Issued: ${data.date.toLocaleDateString()}`, { align: 'center' });
  doc.text('SkillSync Platform', { align: 'center' });
}

export function generateCVPdf(doc: PDFKit.PDFDocument, data: any) {
  // Simple modern layout
  doc.fontSize(25).font('Helvetica-Bold').text(data.cv_name || 'Curriculum Vitae', { align: 'left' });
  doc.moveDown(0.5);
  
  if (data.personal_info) {
    const info = data.personal_info;
    doc.fontSize(12).font('Helvetica').text(`${info.name || ''} | ${info.email || ''} | ${info.phone || ''}`);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
  }

  const sections = ['education', 'experience', 'skills', 'projects'];
  
  sections.forEach(section => {
    if (data[section] && Array.isArray(data[section]) && data[section].length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text(section.toUpperCase());
      doc.moveDown(0.5);
      
      data[section].forEach((item: any) => {
        const title = item.title || item.degree || item.name || '';
        const subtitle = item.company || item.school || '';
        const desc = item.description || '';
        
        doc.fontSize(12).font('Helvetica-Bold').text(title);
        if (subtitle) doc.fontSize(11).font('Helvetica-Oblique').text(subtitle);
        if (desc) doc.fontSize(10).font('Helvetica').text(desc);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }
  });
}