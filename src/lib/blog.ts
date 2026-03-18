import { orei } from "@/content/blog/orei";
import { irai } from "@/content/blog/irai";
import { owabi } from "@/content/blog/owabi";
import { saisoku } from "@/content/blog/saisoku";
import { houkoku } from "@/content/blog/houkoku";
import { okotowari } from "@/content/blog/okotowari";
import { aisatsu } from "@/content/blog/aisatsu";
import { english } from "@/content/blog/english";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  orei,
  irai,
  owabi,
  saisoku,
  houkoku,
  okotowari,
  aisatsu,
  english,
];

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
