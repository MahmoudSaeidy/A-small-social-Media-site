// Home.jsx
import * as React from 'react';
import { Nav } from "../src/Components/Navbars"
import Container from '@mui/material/Container';
import { PostProvider } from "../context/PostContext.jsx"
import { Posts } from "../src/Components/Posts"

function Home() {
  return (
    <div>
      <PostProvider>
        <Container maxWidth="md">
          <Nav />
          <Posts isProfilePage={false} />
        </Container>
      </PostProvider>
    </div>
  )
}

export default Home