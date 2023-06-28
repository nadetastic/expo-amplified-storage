import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useState } from 'react';
import uuid from 'react-native-uuid';

import { Amplify, Storage }  from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import * as ImagePicker from 'expo-image-picker';

import config from './src/aws-exports';

Amplify.configure(config);

export default function App() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <MyImagePicker />
          <SignOutButton />
          <StatusBar style="auto" />
        </View>
      </Authenticator>
    </Authenticator.Provider>
  );
}


function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


function MyImagePicker(){
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });
      console.log('..>',result);
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      // const filename = `${uuid.v4()}.jpg`;
      const res = Storage.put('myexpo-image2.jpg', blob, {
        contentType: 'image/jpeg',
        resumable: true,
        progressCallback: event => {
          console.log(`Uploaded: ${event.loaded}/${event.total}`);
        },
        completeCallback: event => {
          console.log('completeCallback: ',event);
        },
        errorCallback: event => {
          console.log('errorcallback: ',event);
        }
        
      });
      console.log(res)
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>FooBar</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Text>{JSON.stringify(image)}</Text>
      <Button title="Upload" onPress={uploadImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}