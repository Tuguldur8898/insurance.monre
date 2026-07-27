import { Document, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, Packer } from "docx";
import { saveAs } from "file-saver";
import type { Contract } from "@/components/broker/ContractList";

function labelCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ text, style: "Label" })],
    width: { size: 40, type: WidthType.PERCENTAGE },
    shading: { fill: "F3F4F6" },
    verticalAlign: "center",
  });
}

function valueCell(value?: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ text: value || "", style: "Value" })],
    width: { size: 60, type: WidthType.PERCENTAGE },
    verticalAlign: "center",
  });
}

function sectionTitle(title: string): Paragraph {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
  });
}

function twoColumnTable(rows: { label: string; value?: string }[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((r) => new TableRow({ children: [labelCell(r.label), valueCell(r.value)] })),
  });
}

export function downloadContractDocx(contract: Contract) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
      paragraphStyles: [
        {
          id: "Label",
          name: "Label",
          basedOn: "Normal",
          run: { bold: true, size: 20 },
        },
        {
          id: "Value",
          name: "Value",
          basedOn: "Normal",
          run: { size: 20 },
        },
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          run: { bold: true, size: 32 },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } },
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
        children: [
          new Paragraph({ text: "ДААТГАЛЫН ГЭРЭЭ / INSURANCE CONTRACT", style: "Title" }),
          new Paragraph({ text: `Гэрээний дугаар: ${contract.number}`, style: "Label" }),
          new Paragraph({ text: `Огноо: ${contract.createdAt.slice(0, 10)}`, style: "Value", spacing: { after: 200 } }),

          sectionTitle("1. Даатгуулагчийн мэдээлэл / Insured Information"),
          twoColumnTable([
            { label: "Овог Нэр / First name and Last name", value: contract.insuredName },
            { label: "Регистрийн дугаар / Register number", value: contract.insuredRegister },
            { label: "Хаяг / Residential Address", value: contract.insuredAddress },
            { label: "Утас / Mobile", value: contract.insuredPhone },
          ]),

          sectionTitle("2. Даатгалчийн мэдээлэл / Insurer Information"),
          twoColumnTable([
            { label: "Овог Нэр / First name and Last name", value: contract.insurerName },
            { label: "Регистрийн дугаар / Register number", value: contract.insurerRegister },
            { label: "Жолоочийн үнэмлэхний дугаар / Driver's License Number", value: contract.insurerLicense },
            { label: "Хаяг / Residential Address", value: contract.insurerAddress },
            { label: "Утас / Mobile", value: contract.insurerPhone },
          ]),

          sectionTitle("3. Даатгалын нөхцөл / Policy Terms"),
          twoColumnTable([
            { label: "Даатгалын үнэлгээ / Sum Insured", value: `₮${contract.valuation.toLocaleString("mn-MN")}` },
            { label: "Хураамжийн хувь / Premium Percentage", value: `${contract.companyRate}%` },
            { label: "Даатгалын хураамж / Premium", value: `₮${contract.premium.toLocaleString("mn-MN")}` },
            { label: "Хөнгөлөлт / Discount", value: `${contract.discountPercent}%` },
            { label: "Эхлэх огноо / Start Date", value: contract.startDate },
            { label: "Хугацаа / Duration", value: contract.duration },
          ]),

          sectionTitle("4. Тээврийн хэрэгслийн мэдээлэл / Vehicle Information"),
          twoColumnTable([
            { label: "Улсын дугаар / State number", value: contract.licensePlate },
            { label: "Арлын дугаар / VIN", value: contract.vinNumber },
            { label: "Тээврийн хэрэгслийн марк / Brand", value: `${contract.vehicleBrand || ""} ${contract.vehicleModel || ""}`.trim() },
            { label: "Өнгө / Color", value: contract.vehicleColor },
            { label: "Зориулалт / Purpose", value: contract.vehiclePurpose },
            { label: "Шатахуун төрөл / Fuel type", value: contract.vehicleFuel },
            { label: "Монголд орж ирсэн он / Year imported", value: contract.vehicleImportYear },
            { label: "Үйлдвэрлэгдсэн он / Year manufactured", value: contract.vehicleYear },
            { label: "Моторын багтаамж / Engine capacity", value: contract.vehicleEngineCapacity },
          ]),

          new Paragraph({
            text: "Энэхүү гэрээгээр даатгалч нь дээр дурдсан тээврийн хэрэгслийг даатгуулж, даатгалын компани нь тохирсон хураамжийн үндсэн дээр хариуцлага хүлээнэ.",
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `gergee-${contract.number}.docx`);
  });
}
