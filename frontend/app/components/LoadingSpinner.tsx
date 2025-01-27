'use client';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-purple-600`}
      />
    </div>
  );
};
