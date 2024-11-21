import '@tensorflow/tfjs-react-native';
import { Button, View, Text, Image } from 'react-native';
import {fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { useRef, useState,useEffect } from 'react';

export function Home(){

  const [isTfReady, setIsTfReady] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState('');
  const image = useRef(null);
  const model = useRef<any>(null);

  useEffect(()=>{
    async function loadModel()
    {
      // Load mobilenet.
      console.log('1');
      await tf.ready();
      console.log(fetch);

      const t2 = performance.now();
      const md = await mobilenet.load();
      const t1 = performance.now();

      console.log(`It took: ${((t2 - t1) / 1000).toFixed(4)}s`);
      model.current = md;
      setIsTfReady(true);
    }
    loadModel();
  },[]);

  async function load() {
    try {
      setClassifying(true);
      // Start inference and show result.
      const img = require('../../dog.jpg');
      const imageAssetPath = Image.resolveAssetSource(img);
      console.log(`imageAssetPath: ${imageAssetPath}`);

      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);
      const imageTensor = decodeJpeg(imageData);

      console.log('6');

      const t1 = performance.now();
      const prediction = await model.current.classify(imageTensor);
      const t2 = performance.now();
      console.log(`It took: ${((t2 - t1) / 1000).toFixed(4)}s`);

      if (prediction && prediction.length > 0) {
        setResult(
          `${prediction[0].className} (${prediction[0].probability.toFixed(3)})`
        );
      }
    } catch (err) {
      console.log(err);
    } finally
    {
      setClassifying(false);
    }
  }

  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Button title="classify" onPress={load}/>
      <Image
        ref={image}
        source={require('../../dog.jpg')}
        style={{width: 200, height: 200}}
      />
      {!isTfReady && <Text>Loading TFJS model...</Text>}
      {classifying && <Text>Classifying...</Text>}
      {result !== '' && <Text>{result}</Text>}
    </View>
  );
}
