export declare class CreateArtistDto {
    slug: string;
    name: string;
    tagline?: string;
    bio: string;
    city?: string;
    coverImage?: string;
    headerImage?: string;
    whatsapp?: string;
}
export declare class UpdateArtistDto {
    name?: string;
    tagline?: string;
    bio?: string;
    city?: string;
    coverImage?: string;
    headerImage?: string;
    whatsapp?: string;
    isActive?: boolean;
}
export declare class CreateSpecDto {
    label: string;
    category: string;
}
export declare class CreateSocialDto {
    platform: string;
    url: string;
    label?: string;
}
