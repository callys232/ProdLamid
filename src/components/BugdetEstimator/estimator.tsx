// pages/EstimatorPage.tsx
import LaborInput from "./labourInput";
import MaterialsInput from "./materialsInput";
import TechnologyInput from "./TechnologyInput";
import TimelineInput from "./TimelineInput";
import RiskInput from "./riskInput";
import RegulatoryInput from "./RegulatoryInput";
import QAInput from "./QAInput";
import ClientSideInput from "./ClientSideInput";
import SustainabilityInput from "./SustainabilityInput";
import VendorInput from "./VendorInput";
import LifecycleInput from "./LifecycleInput";
import FinancingInput from "./FinancingInput";
import EstimateSummary from "./EstimateSummary";
import ExportOptions from "./ExportOptions";

export default function EstimatorPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <header className="bg-black text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Lamid Premium Estimator</h1>
                <ExportOptions />
            </header>

            <main className="p-8 space-y-8">
                <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Labor & Team</h2>
                    <LaborInput />
                </section>

                <section className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Materials & Technology</h2>
                    <MaterialsInput />
                    <TechnologyInput />
                </section>

                <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Timeline & Overheads</h2>
                    <TimelineInput />
                </section>

                <section className="bg-red-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Risk & Compliance</h2>
                    <RiskInput />
                    <RegulatoryInput />
                </section>

                <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Client, QA & Sustainability</h2>
                    <ClientSideInput />
                    <QAInput />
                    <SustainabilityInput />
                </section>

                <section className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Vendors & Lifecycle</h2>
                    <VendorInput />
                    <LifecycleInput />
                </section>

                <section className="bg-black text-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-xl font-semibold border-b-2 border-[#c12129] mb-4">Financing & Summary</h2>
                    <FinancingInput />
                    <EstimateSummary
                        laborTotal={0}
                        materialsTotal={0}
                        technologyTotal={0}
                        timelineTotal={0}
                        riskTotal={0}
                        regulatoryTotal={0}
                        qaTotal={0}
                        clientTotal={0}
                        sustainabilityTotal={0}
                        vendorTotal={0}
                        lifecycleTotal={0}
                        financingTotal={0}
                    />
                </section>
            </main>
        </div>
    );
}
