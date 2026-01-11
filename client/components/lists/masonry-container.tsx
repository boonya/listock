import Masonry from '@mui/lab/Masonry';
import {Box} from '@mui/material';
import {useLayoutEffect, useRef, useState} from 'react';

const MIN_WIDTH = 250;
const MAX_WIDTH = 360;

type Props = {children: NonNullable<React.ReactNode>};

export default function MasonryContainer({children}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const columns = Math.max(
          1,
          Math.floor(width / MIN_WIDTH),
          Math.floor(width / MAX_WIDTH),
        );
        setColumns(columns);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{width: '100%'}}>
      <Masonry columns={columns} spacing={2}>
        {children}
      </Masonry>
    </Box>
  );
}
