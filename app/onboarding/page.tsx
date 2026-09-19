"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import AuthGuard from "../components/AuthGuard";

const TOTAL_STEPS = 5;
const stepLabels = ["Personal Details", "Identity", "Vehicle", "Documents", "Review"];

export default function OnboardingPage() {
  return (
    <AuthGuard redirectTo="/signup?redirect=/onboarding">
      <OnboardingContent />
    </AuthGuard>
  );
}

function OnboardingContent() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationalId: "",
    phone: "",
    email: "",
    city: "",
    emergencyName: "",
    emergencyPhone: "",
    idDocFront: null as File | null,
    idDocBack: null as File | null,
    selfie: null as File | null,
    vehicleType: "car",
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    color: "",
    capacity: "",
    licenseFront: null as File | null,
    licenseBack: null as File | null,
    vehicleRegistration: null as File | null,
    insurance: null as File | null,
    inspectionCert: null as File | null,
    defensiveDrivingCert: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  async function uploadFile(bucket: string, file: File, path: string) {
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });
    if (error) throw error;
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    return data?.signedUrl ?? null;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You need to be signed in to submit an application.");
      }

      const { error: driverError } = await supabase.from("drivers").upsert({
        id: user.id,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth || null,
        national_id: formData.nationalId,
        phone_number: formData.phone,
        email: formData.email,
        city: formData.city,
        emergency_contact_name: formData.emergencyName || null,
        emergency_contact_phone: formData.emergencyPhone || null,
        application_status: "submitted",
      });
      if (driverError) throw driverError;

      let idFrontUrl: string | null = null;
      let idBackUrl: string | null = null;
      let selfieUrl: string | null = null;

      if (formData.idDocFront) {
        idFrontUrl = await uploadFile(
          "identity-documents",
          formData.idDocFront,
          `${user.id}/id-front`
        );
      }
      if (formData.idDocBack) {
        idBackUrl = await uploadFile(
          "identity-documents",
          formData.idDocBack,
          `${user.id}/id-back`
        );
      }
      if (formData.selfie) {
        selfieUrl = await uploadFile(
          "identity-documents",
          formData.selfie,
          `${user.id}/selfie`
        );
      }

      const { error: identityError } = await supabase
        .from("driver_identity")
        .insert({
          driver_id: user.id,
          id_document_front_url: idFrontUrl,
          id_document_back_url: idBackUrl,
          selfie_url: selfieUrl,
        });
      if (identityError) throw identityError;

      const { error: vehicleError } = await supabase.from("vehicles").insert({
        driver_id: user.id,
        vehicle_type: formData.vehicleType,
        make: formData.make,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : null,
        plate_number: formData.plateNumber,
        color: formData.color || null,
        capacity: formData.capacity || null,
      });
      if (vehicleError) throw vehicleError;

      const documentFields: { file: File | null; type: string }[] = [
        { file: formData.licenseFront, type: "drivers_license_front" },
        { file: formData.licenseBack, type: "drivers_license_back" },
        { file: formData.vehicleRegistration, type: "vehicle_registration" },
        { file: formData.insurance, type: "insurance" },
        { file: formData.inspectionCert, type: "vehicle_inspection" },
        {
          file: formData.defensiveDrivingCert,
          type: "defensive_driving_certificate",
        },
      ];

      for (const doc of documentFields) {
        if (doc.file) {
          const url = await uploadFile(
            "driver-documents",
            doc.file,
            `${user.id}/${doc.type}`
          );
          const { error: docError } = await supabase
            .from("driver_documents")
            .insert({
              driver_id: user.id,
              document_type: doc.type,
              file_url: url,
              status: "pending",
            });
          if (docError) throw docError;
        }
      }

      router.push("/onboarding/complete");
    } catch (err) {
      console.error("Submission error:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-lg font-semibold text-green-700">TakeOFF</span>
        <div className="flex items-center gap-5">
          <Link href="/" className="text-sm">Home</Link>
          <Link href="/signin" className="text-sm">Sign in</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <span className="inline-block bg-green-50 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Step {step} of {TOTAL_STEPS}
          </span>
          <h1 className="text-2xl font-semibold mb-1">{stepLabels[step - 1]}</h1>
        </div>

        <div className="flex justify-between items-center border-b pb-6 mb-8 text-xs text-gray-500 overflow-x-auto gap-4">
          {stepLabels.map((label, i) => {
            const num = i + 1;
            const active = num === step;
            const done = num < step;
            return (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-2 whitespace-nowrap ${active ? "font-medium text-green-700" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active || done ? "bg-green-600 text-white" : "bg-gray-100"}`}>
                    {num}
                  </span>
                  <span>{label}</span>
                </div>
                {num < TOTAL_STEPS && <span className="text-gray-300">—</span>}
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-md p-3">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={step < TOTAL_STEPS ? handleNext : (e) => e.preventDefault()} className="lg:col-span-2 space-y-4">

            {step === 1 && (
              <>
                <Field label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date of birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                  <Field label="National ID number" name="nationalId" value={formData.nationalId} onChange={handleChange} placeholder="Enter national ID number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Phone number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+263 7XX XXX XXX" />
                  <Field label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </div>
                <Field label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" />
                <p className="text-xs text-gray-400 pt-2">Emergency contact (optional)</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Emergency contact name" name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Enter contact name" required={false} />
                  <Field label="Emergency contact phone" name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleChange} placeholder="+263 7XX XXX XXX" required={false} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FileField label="ID/Passport — front" name="idDocFront" onChange={handleFileChange} fileName={formData.idDocFront?.name} />
                  <FileField label="ID/Passport — back" name="idDocBack" onChange={handleFileChange} fileName={formData.idDocBack?.name} />
                </div>
                <FileField label="Selfie / liveness photo" name="selfie" onChange={handleFileChange} fileName={formData.selfie?.name} accept="image/*" />
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1">Vehicle type</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="bike">Motorbike</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Make" name="make" value={formData.make} onChange={handleChange} placeholder="e.g. Toyota" />
                  <Field label="Model" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Corolla" />
                  <Field label="Year" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 2018" />
                </div>
                <Field label="Registration / number plate" name="plateNumber" value={formData.plateNumber} onChange={handleChange} placeholder="Enter plate number" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Vehicle color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White" required={false} />
                  <div>
                    <label className="block text-xs font-medium mb-1">Vehicle capacity (optional)</label>
                    <select name="capacity" value={formData.capacity} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option value="">Select capacity</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FileField label="Driver's license — front" name="licenseFront" onChange={handleFileChange} fileName={formData.licenseFront?.name} />
                  <FileField label="Driver's license — back" name="licenseBack" onChange={handleFileChange} fileName={formData.licenseBack?.name} />
                </div>
                <FileField label="Vehicle registration / logbook" name="vehicleRegistration" onChange={handleFileChange} fileName={formData.vehicleRegistration?.name} />
                <FileField label="Proof of insurance" name="insurance" onChange={handleFileChange} fileName={formData.insurance?.name} />
                <p className="text-xs text-gray-400 pt-2">Optional at registration</p>
                <FileField label="Vehicle inspection / fitness certificate" name="inspectionCert" onChange={handleFileChange} fileName={formData.inspectionCert?.name} />
                <FileField label="Defensive driving certificate" name="defensiveDrivingCert" onChange={handleFileChange} fileName={formData.defensiveDrivingCert?.name} />
              </>
            )}

            {step === 5 && (
              <div className="space-y-4 text-sm">
                <ReviewSection title="Personal details" rows={[
                  ["Full name", formData.fullName],
                  ["Date of birth", formData.dateOfBirth],
                  ["National ID", formData.nationalId],
                  ["Phone", formData.phone],
                  ["Email", formData.email],
                  ["City", formData.city],
                  ["Emergency contact", formData.emergencyName],
                  ["Emergency phone", formData.emergencyPhone],
                ]} />
                <ReviewSection title="Identity" rows={[
                  ["ID front", formData.idDocFront?.name || "Not uploaded"],
                  ["ID back", formData.idDocBack?.name || "Not uploaded"],
                  ["Selfie", formData.selfie?.name || "Not uploaded"],
                ]} />
                <ReviewSection title="Vehicle" rows={[
                  ["Type", formData.vehicleType],
                  ["Make/Model", `${formData.make} ${formData.model}`],
                  ["Year", formData.year],
                  ["Plate number", formData.plateNumber],
                  ["Color", formData.color],
                  ["Capacity", formData.capacity],
                ]} />
                <ReviewSection title="Documents" rows={[
                  ["License front", formData.licenseFront?.name || "Not uploaded"],
                  ["License back", formData.licenseBack?.name || "Not uploaded"],
                  ["Registration", formData.vehicleRegistration?.name || "Not uploaded"],
                  ["Insurance", formData.insurance?.name || "Not uploaded"],
                  ["Inspection cert", formData.inspectionCert?.name || "Not provided"],
                  ["Defensive driving cert", formData.defensiveDrivingCert?.name || "Not provided"],
                ]} />
              </div>
            )}

            <div className="flex items-center justify-between pt-6">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="text-xs text-gray-500 hover:text-black transition">← Back</button>
              ) : <span />}

              {step < TOTAL_STEPS ? (
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition">Continue →</button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900 mb-1">Why drive with TakeOFF?</p>
              <ul className="text-xs text-green-800 space-y-2 mt-2">
                <li>• Earn on your own flexible schedule</li>
                <li>• Fast and reliable weekly payouts</li>
                <li>• Dedicated 24/7 driver support team</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-700 mb-1">Your information is safe</p>
              <p className="text-xs text-gray-500">We use industry-standard encryption to keep your details secure.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", required = true }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input type={type} name={name} required={required} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-600" />
    </div>
  );
}

function FileField({ label, name, onChange, fileName, accept = "image/*,application/pdf" }: {
  label: string; name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string; accept?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input type="file" name={name} accept={accept} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
      {fileName && <p className="text-xs text-green-700 mt-1">Selected: {fileName}</p>}
    </div>
  );
}

function ReviewSection({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="font-medium mb-2">{title}</p>
      <div className="space-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-gray-600">
            <span>{label}</span>
            <span className="text-black">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}