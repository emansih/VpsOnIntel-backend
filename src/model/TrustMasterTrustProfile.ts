export interface TrustMasterProfile {
    trustmaster_id:     string;
    trust:              Trust | null;
    newest_trust:       Trust;
    summary:            Summary;
    summary_unverified: SummaryUnverified;
    generation:         number;
}

export interface Trust {
    decision:   string;
    updated_at: Date;
}

export interface Summary {
    approver: number;
    fully:    number;
}

export interface SummaryUnverified {
    fully: number;
}
