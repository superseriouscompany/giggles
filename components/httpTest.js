class HttpTestApp extends Component {
  constructor(props) {
    super(props);
    this.state = { nice: '' }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.pressed}>
          Sup son {this.state.nice}
        </Text>
      </View>
    )
  }

  pressed = () => {
    fetch("https://superseriouscompany.com/dias", {
      method: 'POST'
    }).then((response) => {
      debugger;
      this.setState({nice: response.json().good});
    }, (error) => {
      debugger;
    })
  }
}
