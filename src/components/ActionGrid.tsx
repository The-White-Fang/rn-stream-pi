import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { ActionButton } from './ActionButton';

export interface Action {
  id: string;
  displayText: string;
  type: 'normal' | 'toggle' | 'folder' | 'gauge';
  isToggled?: boolean;
  isDisabled?: boolean;
}

interface ActionGridProps {
  actions: Action[];
  columns: number;
  gap?: number;
  style?: ViewStyle;
  onActionPress: (actionId: string) => void;
}

export const ActionGrid: React.FC<ActionGridProps> = ({
  actions,
  columns,
  gap = 8,
  style,
  onActionPress,
}: ActionGridProps) => {
  const screenWidth = Dimensions.get('window').width;
  const buttonWidth = (screenWidth - (columns + 1) * gap) / columns;

  const rows = Math.ceil(actions.length / columns);
  const gridItems = Array.from({ length: rows * columns }, (_, index) => actions[index] || null);

  return (
    <View style={[styles.container, { gap }, style]}>
      {gridItems.map((action, index) => (
        <View
          key={action?.id || `empty-${index}`}
          style={[
            styles.buttonContainer,
            {
              width: buttonWidth,
              height: buttonWidth,
            },
          ]}
        >
          {action && (
            <ActionButton
              id={action.id}
              displayText={action.displayText}
              onPress={() => onActionPress(action.id)}
              isToggled={action.isToggled}
              isDisabled={action.isDisabled}
              style={styles.button}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 8,
  },
  buttonContainer: {
    padding: 4,
  },
  button: {
    flex: 1,
  },
}); 