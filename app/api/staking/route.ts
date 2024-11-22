import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { StakingRewardTable } from '@/types/staking'

export async function GET() {
  try {
    const headers = {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    const result = await pool.query('SELECT * FROM staking_rewards_new')
    const stakingData: StakingRewardTable[] = result.rows

    return NextResponse.json(stakingData, { headers })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staking data' },
      { status: 500 }
    )
  }
} 