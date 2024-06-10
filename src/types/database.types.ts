export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			_prisma_migrations: {
				Row: {
					applied_steps_count: number
					checksum: string
					finished_at: string | null
					id: string
					logs: string | null
					migration_name: string
					rolled_back_at: string | null
					started_at: string
				}
				Insert: {
					applied_steps_count?: number
					checksum: string
					finished_at?: string | null
					id: string
					logs?: string | null
					migration_name: string
					rolled_back_at?: string | null
					started_at?: string
				}
				Update: {
					applied_steps_count?: number
					checksum?: string
					finished_at?: string | null
					id?: string
					logs?: string | null
					migration_name?: string
					rolled_back_at?: string | null
					started_at?: string
				}
				Relationships: []
			}
			activities: {
				Row: {
					id: number
					operation: string
					recordId: number | null
					tableName: string
				}
				Insert: {
					id?: number
					operation: string
					recordId?: number | null
					tableName: string
				}
				Update: {
					id?: number
					operation?: string
					recordId?: number | null
					tableName?: string
				}
				Relationships: []
			}
			books: {
				Row: {
					authorId: number
					backStory: string | null
					coverPage: string | null
					createdAt: string
					description: string | null
					genre: string
					id: number
					public: boolean
					title: string
					type: string
					updatedAt: string
				}
				Insert: {
					authorId: number
					backStory?: string | null
					coverPage?: string | null
					createdAt?: string
					description?: string | null
					genre: string
					id?: number
					public?: boolean
					title: string
					type: string
					updatedAt: string
				}
				Update: {
					authorId?: number
					backStory?: string | null
					coverPage?: string | null
					createdAt?: string
					description?: string | null
					genre?: string
					id?: number
					public?: boolean
					title?: string
					type?: string
					updatedAt?: string
				}
				Relationships: [
					{
						foreignKeyName: 'books_authorId_fkey'
						columns: ['authorId']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
			chapters: {
				Row: {
					bookId: number
					createdAt: string
					description: string | null
					id: number
					position: number
					title: string | null
					updatedAt: string
				}
				Insert: {
					bookId: number
					createdAt?: string
					description?: string | null
					id?: number
					position: number
					title?: string | null
					updatedAt: string
				}
				Update: {
					bookId?: number
					createdAt?: string
					description?: string | null
					id?: number
					position?: number
					title?: string | null
					updatedAt?: string
				}
				Relationships: [
					{
						foreignKeyName: 'chapters_bookId_fkey'
						columns: ['bookId']
						isOneToOne: false
						referencedRelation: 'books'
						referencedColumns: ['id']
					},
				]
			}
			pages: {
				Row: {
					chapterId: number
					content: string
					createdAt: string
					has_annotations: boolean
					id: number
					position: number
					updatedAt: string
					words_cnt: number
				}
				Insert: {
					chapterId: number
					content: string
					createdAt?: string
					has_annotations?: boolean
					id?: number
					position: number
					updatedAt: string
					words_cnt?: number
				}
				Update: {
					chapterId?: number
					content?: string
					createdAt?: string
					has_annotations?: boolean
					id?: number
					position?: number
					updatedAt?: string
					words_cnt?: number
				}
				Relationships: [
					{
						foreignKeyName: 'pages_chapterId_fkey'
						columns: ['chapterId']
						isOneToOne: false
						referencedRelation: 'chapters'
						referencedColumns: ['id']
					},
				]
			}
			user_activities: {
				Row: {
					activityId: number
					createdAt: string
					updatedAt: string
					userId: number
				}
				Insert: {
					activityId: number
					createdAt?: string
					updatedAt: string
					userId: number
				}
				Update: {
					activityId?: number
					createdAt?: string
					updatedAt?: string
					userId?: number
				}
				Relationships: [
					{
						foreignKeyName: 'user_activities_activityId_fkey'
						columns: ['activityId']
						isOneToOne: false
						referencedRelation: 'activities'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'user_activities_userId_fkey'
						columns: ['userId']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
			users: {
				Row: {
					avatar: string | null
					createdAt: string
					email: string
					googleId: string
					id: number
					isAnonymous: boolean
					updatedAt: string
					username: string
				}
				Insert: {
					avatar?: string | null
					createdAt?: string
					email: string
					googleId: string
					id?: number
					isAnonymous?: boolean
					updatedAt: string
					username: string
				}
				Update: {
					avatar?: string | null
					createdAt?: string
					email?: string
					googleId?: string
					id?: number
					isAnonymous?: boolean
					updatedAt?: string
					username?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
				PublicSchema['Views'])
		? (PublicSchema['Tables'] &
				PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never
