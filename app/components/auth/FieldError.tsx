interface Props {
  message?: string;
}

export function FieldError({ message }: Props) {
  if (!message) return null;
  return (
    <span style={{ fontSize: '0.72rem', color: '#c0392b', marginTop: '2px', display: 'block' }}>
      {message}
    </span>
  );
}