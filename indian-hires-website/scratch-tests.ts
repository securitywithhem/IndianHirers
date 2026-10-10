export interface ProcessStep {
  title: string;
  description: string;
}

export interface TestimonialsPageContent {
  // existing...
  processHeading: string;
  processLead: string;
  processSteps: ProcessStep[];
}
