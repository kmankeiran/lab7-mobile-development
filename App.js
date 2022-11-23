import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Button, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import ImageSelector from './components/ImageSelector'

const FavouriteMomentScreen = () => {

    const [selectedImage, setSelectedImage] = useState();
    [messageForFile, setMessageForFile] = useState('');

    [dataForDatabase, setDataForDatabase] = useState({});
    [dataFromDatabase, setDataFromDatabase] = useState('');

    //SQLite database section

    const db = SQLite.openDatabase('lab7DB');

  useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ExampleTable2 (id INTEGER PRIMARY KEY NOT NULL, favouriteQuote TEXT, image TEXT);', 
          [], 
          () => console.log('TABLE CREATED!'),
          (_, result) => console.log('TABLE CREATE failed:' + result)
        );
      });

      // retrieve the current contents of the DB tables we want
      retrieveFromDatabase();
    }, 
    // add [] as extra argument to only have this fire on mount and unmount (or else it fires every render/change)
    []
  );

  onFavouriteQuoteChangeHandler = (quote) => {
    setDataForDatabase(prevState => ({ ...prevState, favouriteQuote: quote }));
    
  }

  onImageHandler = (selectedImage) => {
    setDataForDatabase(prevState => ({ ...prevState, image: selectedImage }));
  }

  saveToDatabase = () => {
      // transaction(callback, error, success)
      db.transaction(
        tx => {
          console.log(dataForDatabase.favouriteQuote)
          // executeSql(sqlStatement, arguments, success, error)
          tx.executeSql("INSERT INTO ExampleTable2 (favouriteQuote, image) values (?, ?)", 
            [dataForDatabase.favouriteQuote, dataForDatabase.image],
            (_, { rowsAffected }) => rowsAffected > 0 ? console.log('ROW INSERTED!') : console.log('INSERT FAILED!'),
            (_, result) => console.log('INSERT failed:' + result)
          ); 
        }    
      );
      retrieveFromDatabase();
  }

  retrieveFromDatabase = () => {
    db.transaction(
      tx => {
        tx.executeSql("SELECT * FROM ExampleTable2", 
          [], 
          (_, { rows }) => {     
            console.log("ROWS RETRIEVED!");

            // clear data currently stored
            setDataFromDatabase('');

            let entries = rows._array;
            
            entries.forEach((entry) => {
              setDataFromDatabase(prev => prev + `${entry.id}, ${entry.favouriteQuote}, ${entry.image}\n`);
            });
          },
          (_, result) => {
            console.log('SELECT failed!');
            console.log(result);
          }
        )
      }
    );
  }

    onChangeHandler = (value) => {
        setMessageForFile(value);
      };

    // This function is getting passed as a prop for the onImageSelected in the ImageSelector 
    const imageSelectorHandler = imagePath => {
        setSelectedImage(imagePath);
    }

    // saveToFile = () => {
    //     const filePath = FileSystem.documentDirectory + 'MyNewTextFile.txt';
    //     FileSystem.writeAsStringAsync(filePath, messageForFile, {})
    //       .then(() => {
    //         console.log('File was written!');
    //       })
    //       .catch((error) => {
    //         console.log('An error occurred: ');
    //         console.log(error);
    //       }); 
    //   };

    return (
      <ScrollView>
        <View>
            <View style={styles.form}>
                <Text style={styles.label}>My favourite moment!</Text>
                <Text style={styles.label}>K_hollenbeck</Text>
                {
                    !selectedImage && 
                      <ImageSelector onImageSelected={imageSelectorHandler}></ImageSelector>
                }
                {
                    selectedImage &&
                    <View>
                            <Image style={styles.image} source={{ uri: selectedImage }} />
                            <Button style={styles.button} title="Reset" onPress={() => {setSelectedImage(null); }} />
                            
                            <View style={styles.section}>
                                <TextInput style={styles.textInput} onChangeText={onFavouriteQuoteChangeHandler} placeholder="message to store in file"></TextInput>
                                <Button title="Save Text To File" onPress={()=>saveToDatabase()} />
                            </View>
                            
                        <Text style={styles.dbOutput}>{dataFromDatabase}</Text>
                        
                    </View>
                }
            </View>
        </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
    form: {
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center'
    },
    image: {
        width: 300,
        height: 300
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        marginTop: 20,
        paddingVertical: 4,
        paddingHorizontal: 2,
        textAlignVertical: 'top'
    }
});

export default FavouriteMomentScreen;