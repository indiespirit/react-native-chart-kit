import React from "react"
import { StyleSheet, View, Text } from 'react-native'
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message"

const messageComponent = (props) => {
  const { message, description, backgroundColor } = props.message
  return (
    <View style={[styles.component, { backgroundColor: backgroundColor }]}>
      <Text style={styles.title}>
        {message}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  )
}

export const DotMessage = props => {
  const { position } = props

  return (
    <FlashMessage
      {...props}
      duration={500}
      floating={true}
      position={position || "top"}
      style={styles.flashMessage}
      MessageComponent={(props) => messageComponent(props)}
    />
  )
}

export const showDotMessage = (title, value, color) => {
  return showMessage({
    message: `${title || "Value"}`,
    description: `${value}`,
    backgroundColor: color,
  })
}

export const hideDotMessage = () => {
  return hideMessage()
}

// style custom
const styles = StyleSheet.create({
  component: {
    flex: 0,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: -1, height: 1.5},
    textShadowRadius: 3
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: -1, height: 1.5},
    textShadowRadius: 3
  }
})
