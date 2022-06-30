import { useEffect, useState } from 'react'; 
import FacebookLogin from 'react-facebook-login'; 

function App() {

  const [login, setLogin] = useState(false);
  const [data, setData] = useState({accessToken:''});
  const [picture, setPicture] = useState('');
  const [posts, setPosts] = useState({data:[],paging:{}});

  const responseFacebook = (response) => {
    console.log(response);
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }

  useEffect(() => {
    console.log("effected!", data)
    if (login && data.accessToken) {
      fetch(`https://graph.facebook.com/v14.0/me/feed?access_token=${data.accessToken}&fields=attachments%7Bmedia%7D%2Cmessage`)
        .then((response) => response.json())
        .then((resp) => {
          console.log("feed posts", resp)
          setPosts(resp)
        })
    } 

  }, [login, data])
  
  return (
    <div>
      {!login &&
            <FacebookLogin
              appId="578995610520511"
              autoLoad={true}
              fields="name,email,picture"
              scope="public_profile,user_friends,user_posts"
              callback={responseFacebook}
              icon="fa-facebook" />
          }
          {login &&
            <img src={picture} alt=""/>
          }
          {login? (
            <>
              <p>feed</p>
              {posts.data.filter((p) => p.attachments && p.attachments.data.length !== 0).map((p) => (<div key={p.id}>
                <p>{p.message}</p>
                <img src={p.attachments?.data[0].media.image.src} width={50} height={50} alt=""/>
              </div>))}
            </>
          ):null}
    </div>
  );
}

export default App;
