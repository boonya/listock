import {useEffect, useState} from 'react';

type OnChange = (isOnline: boolean) => unknown;

export function useOnlineStatusEvents(onChange: OnChange) {
  useEffect(() => {
    const controller = new AbortController();

    globalThis.addEventListener('online', () => onChange(true), {
      signal: controller.signal,
    });
    globalThis.addEventListener('offline', () => onChange(false), {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [onChange]);
}

export function useOnlineStatus(onChange?: OnChange) {
  const [isOnline, setOnline] = useState(globalThis.navigator?.onLine ?? true);

  useOnlineStatusEvents((value) => {
    setOnline(value);
    onChange?.(value);
  });

  return isOnline;
}
