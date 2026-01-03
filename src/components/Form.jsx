import { Box, Paper } from '@mui/material'
import React from 'react'

export default function Form() {
  return (
    <div>
        <Box>
            <Typography>Insert My Expense</Typography>
        </Box>
        <Box>
          <Paper>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </Paper>
        </Box>
    </div>
  )
}
