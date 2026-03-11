export type ConsultantProfileStatus = {
    photoUploaded: boolean;
    verifiedBadge: boolean;
    paymentMethodAdded: boolean;
    accountDetailsComplete: boolean;
};

export type ClientProfileStatus = {
    logoUploaded: boolean;
    verifiedBadge: boolean;
    paymentMethodAdded: boolean;
    accountDetailsComplete: boolean;
};

export type ProfileStatus = ConsultantProfileStatus | ClientProfileStatus;

export function calculateCompletion(status: ProfileStatus): number {
    const steps = Object.values(status);
    const filledCount = steps.filter(Boolean).length;
    return Math.round((filledCount / steps.length) * 100);
}
