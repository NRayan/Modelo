import { Button, View, Text, Image } from 'react-native'
import {fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { useRef, useState } from 'react';

export function Home(){
  
  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState('');
  const image = useRef(null);
  
  async function load() {
    try {
      // Load mobilenet.
      console.log("1")
      await tf.ready();
    //   console.log("2")
    //   await tf.setBackend('cpu'); // Certifique-se de usar o backend correto
      console.log("3")
      const model = await mobilenet.load();
      console.log("4")
      setIsTfReady(true);

      console.log("5")
      // Start inference and show result.
      const image = require('../../basketball.jpg');
      const imageAssetPath = Image.resolveAssetSource(image);
      console.log(`imageAssetPath: ${imageAssetPath}`);
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);
      const imageTensor = decodeJpeg(imageData);
      const prediction = await model.classify(imageTensor);

      if (prediction && prediction.length > 0) {
        setResult(
          `${prediction[0].className} (${prediction[0].probability.toFixed(3)})`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Button title='load' onPress={load}/>
      <Image
        ref={image}
        source={require('../../basketball.jpg')}
        style={{width: 200, height: 200}}
      />
      {!isTfReady && <Text>Loading TFJS model...</Text>}
      {isTfReady && result === '' && <Text>Classifying...</Text>}
      {result !== '' && <Text>{result}</Text>}
    </View>
  );
}