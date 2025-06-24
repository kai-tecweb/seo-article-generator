// 画像生成関連の型定義

export interface ImageGenerationRequest {
  prompt: string;
  style: 'realistic' | 'illustration' | 'minimal' | 'abstract' | 'anime' | 'photographic';
  aspectRatio: '16:9' | '1:1' | '4:3' | '9:16';
  includeText: boolean;
  textContent?: string;
  fontSize?: 'small' | 'medium' | 'large';
  textPosition?: 'top' | 'center' | 'bottom';
  color?: string;
  quality?: 'standard' | 'high';
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  imageId?: string;
  prompt?: string;
  style?: string;
  aspectRatio?: string;
  error?: string;
  processingTime?: number;
}

export interface ImageVariation {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  createdAt: string;
}

export interface ImageHistory {
  id: string;
  originalPrompt: string;
  variations: ImageVariation[];
  selectedImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
