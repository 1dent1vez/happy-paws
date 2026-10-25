/** Publish only real profiles and testimonials with permission to use their text and photos. */
export interface WalkerProfile {
  name: string;
  bio: string;
  photo: string; // Local public/ path, for example /images/equipo/nombre.jpg.
  photoAlt: string;
  credentials: string[]; // Verified experience or training only.
}
export interface Testimonial {
  quote: string;
  attribution: string;
}
// No identities, qualifications or customer endorsements were supplied with the project.
export const walkerProfiles: WalkerProfile[] = [];
export const testimonials: Testimonial[] = [];
