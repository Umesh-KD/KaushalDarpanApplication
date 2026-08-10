export interface TableImageConfig {

    /**
     * Width of image in pixels
     * Default: 40
     */
    width?: number;

    /**
     * Height of image in pixels
     * Default: 40
     */
    height?: number;

    /**
     * Image fit
     * cover = crop
     * contain = fit
     */
    fit?: 'cover' | 'contain';

    /**
     * Border style
     */
    borderRadius?: 'circle' | 'rounded' | 'square';

    /**
     * Zoom on hover
     */
    hoverZoom?: boolean;

    /**
     * Lazy load image
     */
    lazyLoad?: boolean;

    /**
     * Default image if image not found
     */
    defaultImage?: string;

    /**
     * Prefix path for image
     *
     * Example:
     * https://localhost:5001/uploads/
     */
    basePath?: string;

    /**
     * Build image path dynamically
     */
    resolver?: (row: any) => string;

}