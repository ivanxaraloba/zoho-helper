interface BodyParam {
    name: string;
    type: string;
    description: string;
    required: boolean;
}

export interface ApiRoute {
    method: string;
    title: string;
    description: string;
    endpoint: string;
    icon: React.ReactNode;
    bodyParams?: BodyParam[];
    execute?: boolean;
}