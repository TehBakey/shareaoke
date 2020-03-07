/* eslint-disable func-names */
import React from 'react';
import axios from 'axios';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import Songs from './Songs.jsx';
import Lyrics from './Lyrics.jsx';
import FavButton from './FavButton.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlaylist: '',
      playerDisplay: false,
      description: '',
      playlistId: 0,
      playlistSongs: [],
      uri: '',
      clickedSong: {},
      userId: 0,
      username: 'guest',
      edit: false,
      editSongs: {},
    };
    this.displayClickedSong = this.displayClickedSong.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.editToggle = this.editToggle.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    console.log(this.props.match.params.id || 'blank');
    if (this.props.location.state.playlist) {
      this.setState({
        currentPlaylist: this.props.location.state.playlist.name,
        description: this.props.location.state.playlist.description,
        playlistId: this.props.location.state.playlist.id,
        userId: this.props.location.state.id_user,
        username: this.props.location.state.username,
      }, () => {
        this.getSongs();
      });
    }
  }

  getSongs() {
    const { playlistId } = this.state;

    axios.get(`/api/playlist/songs/${playlistId}`)
      .then(data => this.setState({
        playlistSongs: data.data,
      }));
  }

  editToggle() {
    this.setState(prevState => ({ edit: !prevState.edit }));
  }

  handleCheck(event) {
    const { editSongs } = this.state;
    editSongs[event.target.value] = event.target.value;
  }

  displayClickedSong(song) {
    const { playerDisplay } = this.state;
    const { uri } = song;

    this.setState({
      playerDisplay: true,
      uri: uri.replace('spotify:track:', ''),
      clickedSong: song,
    });
  }

  render() {
    const {
      currentPlaylist, description, playerDisplay, playlistSongs, uri, clickedSong, userId, username, playlistId, edit,
    } = this.state;
    let favSwitch = '';
    if (this.props.location.state.friend) {
      favSwitch = <FavButton playlistId={playlistId} userId={userId} />;
    }

    let editButton = '';
    let submit = '';
    let name = '';
    let summary = '';

    if (!edit) {
      editButton = <button style={{ right: '50%' }} type="button" className="btn btn-success float-right" onClick={this.editToggle}>Edit</button>;
      summary = description;
      name = currentPlaylist;
      submit = '';
    } else if (edit) {
      editButton = <button style={{ right: '50%' }} type="button" className="btn btn-danger float-right" onClick={this.editToggle}>Cancel</button>;
      submit = <button style={{ right: '50%' }} type="button" className="btn btn-success float-right" onClick={this.editToggle}>Submit</button>;
      summary = (
        <div className="input-group">
          <input className="form-control" aria-label="With textarea" value={this.state.description} />
        </div>
      );
      name = (
        <div className="input-group">
          <input className="form-control" aria-label="With textarea" value={this.state.currentPlaylist} />
        </div>
      );
    }
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/main">
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/createplaylist',
              state: {
                id_user: userId,
                username,
              },
            }}
            >
              Create playlist
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/search',
              state: {
                id_user: userId,
                username,
              },
            }}
            >
              Search
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/playlists',
              state: {
                id_user: userId,
                username,
              },
            }}
            >
              Playlists
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={{
              pathname: '/friends',
              state: {
                id_user: userId,
                username,
              },
            }}
            >
              Friends
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Jumbotron style={{ textAlign: 'center', background: 'orange' }}>
          <h1 style={{ color: 'white' }}>{name}</h1>
          <p style={{ color: 'white' }}>{summary}</p>
        </Jumbotron>
        <div style={{ display: 'flex' }}>
          <TwitterShareButton
            style={{ marginRight: 30 }}
            url="www.twitter.com"
            title={`Check out my awesome shareaoke playlist!!! http://localhost:8080/#/sharedplaylist/${playlistId}/`}
            className="Demo__some-network__share-button"
          >
            <TwitterIcon
              size={64}
              round
            />
          </TwitterShareButton>
          {}
          {favSwitch}
        </div>
        <div className="editButton clearfix">
          {editButton}
          {submit}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {playlistSongs.map(song => <Songs handleChange={this.handleCheck} edit={edit} key={song.id} song={song} display={this.displayClickedSong} />)}
          </div>
          <div style={{ marginLeft: 200 }}>
            {playerDisplay
              ? (
                <div>
                  <iframe src={`https://open.spotify.com/embed/track/${uri}`} width="300" height="380" frameBorder="0" allowTransparency="true" allow="encrypted-media" />
                </div>
              )
              : null}
          </div>
        </div>
        {playerDisplay
          ? (<Lyrics queryData={clickedSong} />
          ) : null}
      </div>
    );
  }
}

export default Playlist;
