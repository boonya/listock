import GeneralErrorMessage from '@/components/errors/general-message';

export default function NotFound() {
  return (
    <GeneralErrorMessage
      slotProps={{
        h1: {
          children: '404',
        },
        h2: {
          children: 'Сторінку не знайдено.',
        },
      }}
    />
  );
}
