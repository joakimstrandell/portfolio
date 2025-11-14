'use client';

import { isTouchDevice } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function useIsTouchDevice() {
  const [isTouchDeviceState, setIsTouchDeviceState] = useState(false);

  useEffect(() => {
    setIsTouchDeviceState(isTouchDevice());
  }, []);

  return isTouchDeviceState;
}
