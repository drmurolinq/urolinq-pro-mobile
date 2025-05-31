import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';

const EnuresisQuestionnaire = ({ navigation }) => {
  // State for responses (TypeScript interfaces)
  interface SurveyState {
    frequency: string;
    volume: string[];
    qolImpact: string[];
  }

  const [survey, setSurvey] = useState<SurveyState>({
    frequency: '',
    volume: [],
    qolImpact: [],
  });

  // Update responses
  const handleFrequencyChange = (value: string) => {
    setSurvey({ ...survey, frequency: value });
  };

  const handleVolumeChange = (item: string) => {
    setSurvey(prev => ({
      ...prev,
      volume: prev.volume.includes(item)
        ? prev.volume.filter(i => i !== item)
        : [...prev.volume, item],
    }));
  };

  // Submit to Urolinq backend (replace with your API call)
  const submitSurvey = () => {
    console.log('Submitted:', survey);
    navigation.navigate('Results', { score: calculateScore(survey) });
  };

  // Scoring logic (example)
  const calculateScore = (data: SurveyState): number => {
    let score = 0;
    if (data.frequency === '5+') score += 10;
    score += data.qolImpact.length * 2;
    return score;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Enuresis (Bedwetting) Survey</Text>

      {/* Frequency Question */}
      <Text style={styles.question}>How many nights per week do you wet the bed?</Text>
      <RadioButton.Group onValueChange={handleFrequencyChange} value={survey.frequency}>
        <RadioButton.Item label="0" value="0" />
        <RadioButton.Item label="1-2" value="1-2" />
        <RadioButton.Item label="3-4" value="3-4" />
        <RadioButton.Item label="5+" value="5+" />
      </RadioButton.Group>

      {/* Volume Question */}
      <Text style={styles.question}>How much urine is typically leaked?</Text>
      {['Drops', 'Small puddle', 'Large soak'].map(item => (
        <Checkbox.Item
          key={item}
          label={item}
          status={survey.volume.includes(item) ? 'checked' : 'unchecked'}
          onPress={() => handleVolumeChange(item)}
        />
      ))}

      {/* QoL Impact */}
      <Text style={styles.question}>Has enuresis affected your daily life?</Text>
      {['Avoided sleepovers', 'Felt embarrassed', 'Missed work/school'].map(item => (
        <Checkbox.Item
          key={item}
          label={item}
          status={survey.qolImpact.includes(item) ? 'checked' : 'unchecked'}
          onPress={() => 
            setSurvey(prev => ({
              ...prev,
              qolImpact: prev.qolImpact.includes(item)
                ? prev.qolImpact.filter(i => i !== item)
                : [...prev.qolImpact, item],
            }))
          }
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={submitSurvey}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Reuse your existing styles from IPSSQuestionnaire.tsx
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  question: { fontSize: 16, marginVertical: 10, fontWeight: '600' },
  button: { 
    backgroundColor: '#007aff', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 20,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default EnuresisQuestionnaire;
