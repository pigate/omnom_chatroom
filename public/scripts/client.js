var socketService = new SocketService();

var Box = React.createClass({
  render: function(){
    return (
      <div className="box">
      Hello I am a Box.
      </div>
    );
  }
});

React.render(
  <Box />,
  document.getElementById('content')
);
