"use client";

import { useCallback, useEffect, useId, useRef, useState, type HTMLAttributes } from "react";
import { Controller, useForm, type Control, type FieldErrors } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Crown } from "@/components/ornament/Crown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contact, type FormField, type FormToast } from "@/content/contact";
import { contactFormSchema } from "@/lib/validations/contact";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/*
 * The visible fields plus the spam trap. The trap is a real, registered field:
 * people never see or reach it, so a value in it means a script filled the form.
 */
const formSchema = contactFormSchema.extend({ botcheck: z.string().optional() });
type FormValues = z.infer<typeof formSchema>;

type VisibleField = keyof typeof contact.form.fields;

/* Visual order; the first of these with an error takes focus on a failed submit. */
const FIELD_ORDER: readonly VisibleField[] = ["name", "phone", "eventDate", "message"];

const EMPTY_VALUES: FormValues = { name: "", phone: "", eventDate: "", message: "", botcheck: "" };

function isAccepted(result: unknown): boolean {
  return typeof result === "object" && result !== null && "success" in result && result.success === true;
}

/* Loaded on first use: the toaster is its own chunk (see Providers), and this
 * keeps the toast code out of the form's as well. */
async function notify(kind: "error", message: FormToast): Promise<void> {
  const { toast } = await import("sonner");
  toast[kind](message.title, { description: message.description });
}

export interface ContactFormProps {
  /**
   * `env.web3FormsKey`, read on the server. The form is only rendered when it
   * is set (`hasEnquiryForm`); the empty case below is a guard, not a state.
   */
  accessKey: string;
  /** `id` of the heading that names the form. */
  labelledBy: string;
}

/**
 * The enquiry form: react-hook-form + zod, posted to Web3Forms; a sent
 * enquiry is answered by the thank-you panel, a failure by a toast. Validation is ours, not the browser's (`noValidate`): each error is
 * text under its field, linked with `aria-describedby`, in a polite live
 * region, and a failed submit moves focus to the first invalid field.
 *
 * While sending, the button shows a spinner (still under reduced motion) and
 * the form is `aria-busy`. Once Web3Forms accepts the enquiry the form gives
 * way to a thank-you panel with the crown; focus moves to its heading, and
 * its button brings back an empty form.
 *
 * Every string comes from `contact.form`. No entrance animation (motion rule).
 */
export function ContactForm({ accessKey, labelledBy }: ContactFormProps) {
  const copy = contact.form;
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { control, register, handleSubmit, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_VALUES,
  });

  const fieldId = (name: VisibleField) => `${baseId}-${name}`;

  /* Anything typed before this component hydrated is on screen but unknown to
   * the form state; take it over rather than let it be validated as empty. */
  useEffect(() => {
    const form = formRef.current;
    if (form === null) return;
    FIELD_ORDER.forEach((name) => {
      const element = form.elements.namedItem(name);
      const typed = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
      if (typed && element.value !== "") setValue(name, element.value);
    });
  }, [setValue]);

  async function onValid(values: FormValues) {
    if (busy.current) return;
    /* Spam trap filled: drop the submission and say nothing. */
    if (values.botcheck) return;

    /* No access key: say so, point to WhatsApp and the phone, send nothing. */
    if (accessKey === "") {
      await notify("error", copy.toasts.notConfigured);
      return;
    }

    busy.current = true;
    setSending(true);
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: copy.submission.subject,
          from_name: copy.submission.fromName,
          name: values.name,
          phone: values.phone,
          event_date: values.eventDate || copy.submission.eventDateNotGiven,
          message: values.message,
        }),
      });
      const result: unknown = await response.json();

      if (response.ok && isAccepted(result)) {
        reset(EMPTY_VALUES);
        /* The thank-you panel says it; a toast as well would repeat it over
           the page (critique-iter2 m5). Errors still come as toasts. */
        setSent(true);
      } else {
        await notify("error", copy.toasts.error);
      }
    } catch {
      await notify("error", copy.toasts.error);
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  function onInvalid(errors: FieldErrors<FormValues>) {
    const first = FIELD_ORDER.find((name) => errors[name] !== undefined);
    if (first !== undefined) document.getElementById(fieldId(first))?.focus();
  }

  if (sent) {
    return <ContactSuccess onAgain={() => setSent(false)} />;
  }

  return (
    <form
      ref={formRef}
      noValidate
      /* Before this component hydrates (or without JavaScript) the browser
         submits the form itself: a POST to Web3Forms with the same fields,
         never a GET that would put the visitor's details in the URL. */
      method="post"
      action={WEB3FORMS_ENDPOINT}
      aria-labelledby={labelledBy}
      aria-busy={sending}
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value={copy.submission.subject} />
      <input type="hidden" name="from_name" value={copy.submission.fromName} />

      <p className="type-small text-muted-foreground">{copy.requiredLegend}</p>

      {/* Spam trap: off screen, out of the tab order, hidden from assistive technology. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${baseId}-botcheck`}>{copy.honeypotLabel}</label>
        <input id={`${baseId}-botcheck`} type="text" tabIndex={-1} autoComplete="off" {...register("botcheck")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow control={control} name="name" id={fieldId("name")} autoComplete="name" />
        <FormRow
          control={control}
          name="phone"
          id={fieldId("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>
      <FormRow control={control} name="eventDate" id={fieldId("eventDate")} type="date" />
      <FormRow control={control} name="message" id={fieldId("message")} multiline />

      <Button type="submit" aria-disabled={sending} className="w-full sm:w-auto sm:self-start">
        {sending ? <Loader2 aria-hidden="true" className="size-5 motion-safe:animate-spin" /> : null}
        {sending ? copy.sending : copy.submit}
      </Button>
    </form>
  );
}

/** The thank-you panel that replaces the form once an enquiry is accepted. */
function ContactSuccess({ onAgain }: { onAgain: () => void }) {
  const { success } = contact.form;

  /* Stable ref callback, run once when the panel mounts. The panel is much
     shorter than the form it replaces, so it is first brought to the middle
     of the screen (instantly; under the fixed header otherwise), then its
     heading takes focus so a screen reader announces it and the keyboard
     continues from here. */
  const focusOnMount = useCallback((node: HTMLHeadingElement | null) => {
    if (node === null) return;
    node.scrollIntoView({ block: "center" });
    node.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div aria-hidden="true" className="crown-draw text-hairline">
        <Crown size="xl" />
      </div>
      <span aria-hidden="true" className="rule-double w-16" />
      <h3 ref={focusOnMount} tabIndex={-1} className="type-h3 max-w-heading-wide text-heading outline-none">
        {success.heading}
      </h3>
      <p className="type-body max-w-measure-tight text-muted-foreground">{success.body}</p>
      <Button type="button" variant="outline" onClick={onAgain}>
        {success.again}
      </Button>
    </div>
  );
}

interface FormRowProps {
  control: Control<FormValues>;
  name: VisibleField;
  id: string;
  type?: "text" | "tel" | "date";
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  /** Render a textarea. */
  multiline?: boolean;
}

/** One labelled field (Docs/UI_UX_V2.md §7.8): label, control, help, error. */
function FormRow({ control, name, id, type = "text", inputMode, autoComplete, multiline = false }: FormRowProps) {
  const copy = contact.form;
  const field: FormField = copy.fields[name];
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { name: fieldName, value, onChange, onBlur }, fieldState }) => {
        const error = fieldState.error?.message;
        const describedBy =
          [field.helper === null ? null : helpId, error === undefined ? null : errorId]
            .filter((part): part is string => part !== null)
            .join(" ") || undefined;

        const shared = {
          id,
          name: fieldName,
          value: value ?? "",
          onChange,
          onBlur,
          placeholder: field.placeholder || undefined,
          "aria-required": field.required,
          "aria-invalid": error !== undefined,
          "aria-describedby": describedBy,
        };

        return (
          <div className="flex flex-col">
            <Label htmlFor={id} className="mb-2">
              {field.label}
              {field.required ? (
                <>
                  <span aria-hidden="true"> {copy.requiredMark}</span>
                  <span className="sr-only"> {copy.requiredNote}</span>
                </>
              ) : (
                <span className="font-normal text-muted-foreground"> {copy.optionalNote}</span>
              )}
            </Label>

            {multiline ? (
              <Textarea rows={5} {...shared} />
            ) : (
              <Input type={type} inputMode={inputMode} autoComplete={autoComplete} {...shared} />
            )}

            {field.helper === null ? null : (
              <p id={helpId} className="type-small mt-2 text-muted-foreground">
                {field.helper}
              </p>
            )}

            {/* Always in the DOM (and empty until needed), so a new error is announced. */}
            <div aria-live="polite">
              {error === undefined ? null : (
                <p id={errorId} className="type-small mt-2 font-medium text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
