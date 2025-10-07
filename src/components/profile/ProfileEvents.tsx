'use client';

import React from 'react';
import { EventHistory } from '../event/EventHistory';

interface ProfileEventsProps {
    userToken: string;
}

export function ProfileEvents({ userToken }: ProfileEventsProps) {
    return <EventHistory userToken={userToken} />;
}
