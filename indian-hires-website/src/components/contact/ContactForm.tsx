"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      eventDate: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    if (!process.env.NEXT_PUBLIC_WEB3FORMS_KEY) {
      console.error("Missing NEXT_PUBLIC_WEB3FORMS_KEY");
      toast.error("Form is not configured.", {
        description: "Please contact us directly via phone or WhatsApp for now.",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: "New Enquiry from IndianHirers Website",
          from_name: "IndianHirers Website",
          name: values.name,
          phone: values.phone,
          event_date: values.eventDate || "Not specified",
          message: values.message,
          botcheck: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Enquiry sent!", {
          description: "Thanks for reaching out — we'll get back to you within a few hours.",
        });
        form.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Something went wrong.", {
        description: "Please try again, or reach us directly via WhatsApp or phone.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-surface-2 border border-border rounded-2xl p-6 md:p-8">
      <h2 className="font-serif text-2xl text-cream font-bold mb-1">Send an Enquiry</h2>
      <p className="font-sans text-cream/60 text-sm mb-6">We&apos;ll get back to you within a few hours.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
          
          <FormField
            control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name <span aria-hidden="true" className="text-cream">*</span><span className="sr-only"> (required)</span></FormLabel>
                    <FormControl>
                      <Input aria-required="true" required placeholder="e.g. Rohan Mehta" className="focus-visible:ring-gold focus-visible:border-gold" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number <span aria-hidden="true" className="text-cream">*</span><span className="sr-only"> (required)</span></FormLabel>
                    <FormControl>
                      <Input type="tel" aria-required="true" required placeholder="e.g. 98765 43210" className="focus-visible:ring-gold focus-visible:border-gold" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date (optional)</FormLabel>
                    <FormControl>
                      <Input type="date" className="focus-visible:ring-gold focus-visible:border-gold" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us about your event</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        placeholder="Number of guests, items needed, venue, etc." 
                        className="focus-visible:ring-gold focus-visible:border-gold" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-maroon text-cream rounded-full hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending...
                  </>
                ) : (
                  "Send Enquiry"
                )}
              </Button>
        </form>
      </Form>
    </div>
  );
}
