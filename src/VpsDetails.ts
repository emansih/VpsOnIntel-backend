export interface VpsDetails {
    activationDetails: ActivationDetail[];
}

export interface ActivationDetail {
    wayspotId:                      string;
    invalidWayspotId:               boolean;
    activationStatus:               string;
    viableScanData:                 ViableScanDatum[];
    viableScansNeeded?:             number;
    lastActivationAttemptTimestamp: Date;
    activationReady?:               boolean;
}

export interface ViableScanDatum {
    timestampMs: Date;
}
