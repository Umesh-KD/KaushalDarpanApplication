export interface TableStatus {

    /**
     * Data Value
     * Example :
     * Approved
     */
    value:any;

    /**
     * Badge Css Class
     * approved
     * rejected
     * pending
     */
    cssClass:string;

    /**
     * Display Text
     */
    text?:string;

    icon?:string;

}