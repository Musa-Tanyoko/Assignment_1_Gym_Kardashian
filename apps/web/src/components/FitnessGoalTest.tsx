import { useState } from 'react';
import { useTRPCContext } from './TRPCProvider';
import { Button } from './ui/button';

export const FitnessGoalTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const trpcClient = useTRPCContext();

  const testSetFitnessGoal = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      // Test with a mock user ID
      const testUserId = 'test-user-123';
      const testGoal = 'weight-loss';
      
      console.log('Testing setFitnessGoal with:', { uid: testUserId, fitnessGoal: testGoal });
      
      const response = await trpcClient.user.setFitnessGoal({
        uid: testUserId,
        fitnessGoal: testGoal,
      });
      
      console.log('setFitnessGoal response:', response);
      setResult(`Success! Response: ${JSON.stringify(response)}`);
    } catch (err) {
      console.error('Test failed:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetUser = async () => {
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      const testUserId = 'test-user-123';
      console.log('Testing getUser with:', testUserId);
      
      const user = await trpcClient.user.getById(testUserId);
      
      console.log('getUser response:', user);
      setResult(`User data: ${JSON.stringify(user, null, 2)}`);
    } catch (err) {
      console.error('Test failed:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Fitness Goal Test</h2>
      
      <div className="space-y-4">
        <Button 
          onClick={testSetFitnessGoal} 
          disabled={isLoading}
          className="mr-2"
        >
          Test Set Fitness Goal
        </Button>
        
        <Button 
          onClick={testGetUser} 
          disabled={isLoading}
          variant="outline"
        >
          Test Get User
        </Button>
        
        {isLoading && (
          <div className="text-blue-600">Loading...</div>
        )}
        
        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <pre className="text-sm text-green-800 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <pre className="text-sm text-red-800 whitespace-pre-wrap">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}; 