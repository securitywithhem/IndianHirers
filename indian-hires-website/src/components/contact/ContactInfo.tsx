import { Phone, MessageCircle, Mail, Clock } from 'lucide-react';
import { contactContent } from '@/content/contact';
import { env } from '@/lib/env';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 space-y-6">
        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
            <Phone size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-sans">Phone</p>
            <a 
              href={`tel:${env.phone}`} 
              className="text-ink font-medium font-sans hover:text-gold-text transition-colors block"
            >
              {contactContent.phone}
            </a>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-whatsapp/10 text-whatsapp flex items-center justify-center shrink-0">
            <MessageCircle size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-sans">WhatsApp</p>
            <a 
              href={`https://wa.me/${env.whatsapp}?text=Hi%2C%20I%27m%20interested%20in%20renting%20crockery%20for%20my%20event.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ink font-medium font-sans hover:text-gold-text transition-colors block"
            >
              {contactContent.phone}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
            <Mail size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-sans">Email</p>
            <a 
              href={`mailto:${env.email}`} 
              className="text-ink font-medium font-sans hover:text-gold-text transition-colors block"
            >
              {contactContent.email}
            </a>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
            <Clock size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-sans">Hours</p>
            <p className="text-ink font-medium font-sans block">
              {contactContent.hours}
            </p>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="rounded-2xl overflow-hidden shadow-md h-64 md:h-80 bg-white">
        {contactContent.mapEmbedUrl ? (
          <iframe 
            src={contactContent.mapEmbedUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade" 
            title="Indian Hires location map" 
          />
        ) : (
          <div className="w-full h-full bg-maroon/5 flex items-center justify-center text-ink/40 text-sm font-sans p-4 text-center">
            Map preview unavailable — add NEXT_PUBLIC_MAP_EMBED_URL
          </div>
        )}
      </div>
    </div>
  );
}
