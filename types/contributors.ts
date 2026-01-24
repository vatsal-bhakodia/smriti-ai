import { JSX } from "react";

export interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
    type: string;
}

export interface ContributorLevel {
    icon: JSX.Element;
    text: string;
    color: string;
    level: number;
    requirement: string;
}

export interface LevelRequirement {
    level: string;
    icon: JSX.Element;
    requirement: string;
    description: string;
    color: string;
    benefits: string[];
}