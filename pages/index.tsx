import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Card, CardContent, CardHeader, Container, Feed, Form, FormComponent, Header, Icon, Label, Menu, Message, Segment, SegmentGroup, TextArea } from 'semantic-ui-react';
import { useQuery, useMutation, gql } from '@apollo/client'
import { useState } from 'react';

interface Post {
  id: string
  body: string
  userId: string
}
interface PostsData {
  latestPosts: Post[]
}

const MainHeader = () => {
  return <Menu fixed='top'>
    <Menu.Item><Header size='medium'>しょうもなgram</Header></Menu.Item>
    <Menu.Item position='right'>つくった人: <a href='https://twitter.com/windymelt' target={"_blank"}>@windymelt</a></Menu.Item>
  </Menu>
}

interface AddPostData {
  post: Post
}
const submitPost = (body: string) => { }

const PostContainer = () => {
  let input: TextArea;

  const [value, setValue] = useState("")

  const [mutateFunction, result] = useMutation<AddPostData>(gql`
    mutation($body: String!) {
      addPost(body: $body) {
        id
      }
    }
  `)

  return <Card>
    <CardHeader>しょうもない事を投稿しよう</CardHeader>
    <CardContent>
      <Form>
        <Form.Field>
          <label>投稿</label>
          <TextArea value={value} onChange={e => setValue(e.target.value)} lines={2} placeholder={"スタバのトイレでうんこした"} className={`attached segment`} ref={node => {
            input = node!;
          }} />

          <Button type="submit" attached="bottom" primary onClick={(e) => {
            console.log(input.state);
            mutateFunction({ variables: { body: input.props.value! as string } })
          }}>投稿</Button>
        </Form.Field>
      </Form>
    </CardContent>
  </Card >
}

interface ShoumonaProps {
  body: string
  userId: string
}
const Shoumona = (props: ShoumonaProps) => {
  return <Feed>
    <Feed.Event>
      <Feed.Label><img src='https://www.3qe.us/yuyuko.gif'></img></Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User>{props.userId}</Feed.User> 投稿 <Feed.Date>1分前</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          {props.body}
        </Feed.Extra>
        <Feed.Meta>
          <Feed.Like>
            <Icon name="poop" ></Icon> しょうもな！
          </Feed.Like>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  </Feed>
}

const PostLoader = () => {
  const { loading, error, data } = useQuery<PostsData>(gql`
    query {
      latestPosts(count: 10) {
        id
        body
        userId
      }
    }
  `)

  if (loading) return <SegmentGroup ><Segment loading={true}>loading...</Segment></SegmentGroup>

  if (error) return <Message error>
    <Header>Error!</Header>
    <Segment inverted><code>{JSON.stringify(error)}</code></Segment>
  </Message>

  if (!data) return <p>No data</p>

  const { latestPosts } = data
  if (!latestPosts) return null

  console.log(latestPosts)

  return <SegmentGroup className={`basic`}>
    {latestPosts.map((post) => <Segment key={post.id}><Shoumona body={post.body} userId={post.userId} /></Segment>)}
  </SegmentGroup>
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <MainHeader />
      <main>
        <Container>
          <PostContainer />
          <PostLoader />
        </Container>
      </main>
      <Head>
        <title>しょうもなgram</title>
        <meta name="description" content="しょうもなgram" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}

export default Home
