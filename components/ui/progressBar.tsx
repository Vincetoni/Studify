import { View } from 'react-native'

type Props = {
  total: number
  currentIndex: number
  progress: ('correct' | 'wrong' | 'unanswered')[]
}

const ProgressBar = ({ total = 1, currentIndex = 0, progress = [] }: Props) => {
  return (
    <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 24 }}>
      {Array.from({ length: total }).map((_, index) => {
        let backgroundColor = '#1a1a2e'

        if (progress[index] === 'correct') {
          backgroundColor = '#22c55e'
        } else if (progress[index] === 'wrong') {
          backgroundColor = '#ef4444'
        } else if (index === currentIndex) {
          backgroundColor = '#6C63FF'
        }

        return (
          <View
            key={index}
            style={{
              backgroundColor,
              flex: 1,
              height: 4,
              borderRadius: 2,
            }}
          />
        )
      })}
    </View>
  )
}

export default ProgressBar