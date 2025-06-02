import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export interface ActionButtonProps {
  id: string;
  displayText: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isToggled?: boolean;
  isDisabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  displayText,
  onPress,
  style,
  textStyle,
  isToggled = false,
  isDisabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isToggled && styles.toggledButton,
        isDisabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text
        style={[
          styles.text,
          isToggled && styles.toggledText,
          isDisabled && styles.disabledText,
          textStyle,
        ]}
      >
        {displayText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    minHeight: 100,
  },
  toggledButton: {
    backgroundColor: '#1976D2',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggledText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#757575',
  },
}); 