'use client';

import React from 'react';
import { CertificateList } from '../event/CertificateList';

interface ProfileCertificatesProps {
    userToken: string;
}

export function ProfileCertificates({ userToken }: ProfileCertificatesProps) {
    return <CertificateList userToken={userToken} />;
}
