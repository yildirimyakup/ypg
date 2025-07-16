import React from 'react';
import { Box } from '@mui/material';

const ChalkboardFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#1e3d2f',
                border: '8px solid #8B5E3C',
                borderRadius: '12px',
                padding: 3,
                color: '#fff',
                fontFamily: '"Shadows Into Light", cursive',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                textShadow: '1px 1px 0 #000',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </Box>
    );
};

export default ChalkboardFrame;
