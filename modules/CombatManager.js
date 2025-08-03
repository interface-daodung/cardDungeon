// CombatManager.js - Qu?n l� logic chi?n d?u v� tuong t�c
// Ch?c nang: X? l� logic chi?n d?u, t?n c�ng v� tuong t�c gi?a Warrior v� c�c th? kh�c
// Bao g?m t?n c�ng t? xa, t?n c�ng c?n chi?n, v� x? l� an th?

class CombatManager {
    /**
     * Kh?i t?o CombatManager
     * @param {CharacterManager} characterManager - Qu?n l� tr?ng th�i Character
     * @param {CardManager} cardManager - Qu?n l� th?
     * @param {AnimationManager} animationManager - Qu?n l� animation
     */
    constructor(characterManager, cardManager, animationManager) {
        this.characterManager = characterManager; // Qu?n l� tr?ng th�i Character (HP, weapon)
        this.cardManager = cardManager; // Qu?n l� th? (l?y th�ng tin monster, coin, etc.)
        this.animationManager = animationManager; // Qu?n l� animation (hi?u ?ng combat, render)
    }

    // ===== C�C H�M CH�NH - X? L� COMBAT =====

    /**
     * X? l� khi character an th?
     * @param {number} fromIndex - V? tr� character
     * @param {number} toIndex - V? tr� th? b? an
     * @returns {Object|boolean} Th�ng tin th? b? an ho?c false n?u kh�ng h?p l?
     */
    processCardEating(fromIndex, toIndex) {
        // ===== L?Y TH�NG TIN TH? B? AN =====
        const targetCard = this.cardManager.getCard(toIndex);
        if (!targetCard) {
            return false;
        }


        // ===== X? L� T?N C�NG MONSTER =====
        // N?u c� vu kh� v� an enemy -> t?n c�ng thay v� an
        if (this.characterManager.hasWeapon() && targetCard.type === 'enemy') {
            this.attackMonsterWithWeapon(fromIndex, toIndex);
            return true;
        }

        // ===== X? L� AN TH? S? D?NG cardEffect =====
        // L?y gameState t? EventManager
        const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
        
        
        // G?i cardEffect c?a th?
        const result = targetCard.cardEffect(this.characterManager, gameState, this.cardManager);
        
        
        // ===== X? L� TRAP ANIMATION N?U C?N =====
        if (targetCard.nameId === 'trap' && result && result.shouldTriggerAnimation) {
            this.animationManager.startTrapActivationAnimation(toIndex, targetCard, this.cardManager);
        }
        
        // ===== TR? V? TH�NG TIN TH? B? AN =====
        return result;
    }

    /**
     * T?n c�ng monster v?i vu kh� (c� animation)
     * @param {number} characterIndex - Index c?a character
     * @param {number} monsterIndex - Index c?a monster
     * @returns {boolean} True n?u t?n c�ng th�nh c�ng
     */
    attackMonsterWithWeapon(characterIndex, monsterIndex) {
        // ===== L?Y TH�NG TIN MONSTER V� VU KH� =====
        const monster = this.cardManager.getCard(monsterIndex);
        const monsterHP = monster.hp || 0;
        const weaponDamage = this.characterManager.getCharacterWeaponDurability();
        
        // ===== T�NH TO�N S�T THUONG =====
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        // ===== B?T �?U ANIMATION CHI?N �?U =====
        this.animationManager.startCombatAnimation(characterIndex, monsterIndex, actualDamage);
        
        // ===== X? L� K?T QU? SAU 150ms =====
        setTimeout(() => {
            // ===== �P D?NG S�T THUONG =====
            monster.hp = monsterHP - actualDamage; // Gi?m HP monster
            
            // Gi?m d? b?n vu kh�
            const weaponObject = this.characterManager.getCharacterWeaponObject();
            if (weaponObject) {
                weaponObject.durability -= actualDamage;
            }
            
            // ===== G?I attackWeaponEffect N?U C� =====
            let weaponKillEffect = null;
            if (weaponObject && weaponObject.attackWeaponEffect) {
                const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                weaponKillEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
            }
            
            // ===== C?P NH?T HI?N TH? =====
            this.animationManager.updateCharacterDisplay(); // C?p nh?t hi?n th? d? b?n vu kh�
            
            // ===== C?P NH?T N�T SELL WEAPON =====
            if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                this.animationManager.eventManager.uiManager.updateSellButtonVisibility();
            }
            
            // ===== X? L� KHI MONSTER CH?T =====
            if (monster.hp <= 0) {
                // Th�m hi?u ?ng ch?t cho monster
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
                if (monsterElement) {
                    monsterElement.classList.add('monster-dying');
                }
                
                // ===== G?I killByWeaponEffect N?U C� =====
                // Lazy evaluation: ch? t�nh to�n gameState khi c?n thi?t
                const killEffect = monster.killByWeaponEffect ? 
                    monster.killByWeaponEffect(this.characterManager, null) : null;
                
                // // ===== KI?M TRA HI?U ?NG VU KH� KHI GI?T QU�I =====
                // const weaponObject = this.characterManager.getCharacterWeaponObject();
                
                // if (weaponObject && weaponObject.attackWeaponEffect) {
                //     const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                //     weaponKillEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
                //     // console.log(`?? Weapon kill effect:`, weaponKillEffect);
                // }
                
                // ===== T?O TH? M?I SAU 600ms =====
                setTimeout(() => {
                    let newCard;
                    
                    // Uu ti�n hi?u ?ng vu kh� n?u c�
                    if (weaponKillEffect && weaponKillEffect.shouldCreateCoinUp) {
                        // T?o CoinUp v?i di?m t? hi?u ?ng vu kh�
                        newCard = this.cardManager.cardFactory.createDynamicCoinUp(this.characterManager, weaponKillEffect.coinUpScore);
                    } else if (killEffect && killEffect.type === 'enemy_killed_by_weapon') {
                        // S? d?ng hi?u ?ng d?c bi?t c?a monster
                        if (killEffect.reward.type === 'food3') {
                            // T?o th? Food3
                            newCard = this.cardManager.cardFactory.createCard(killEffect.reward.cardName);
                        } else if (killEffect.reward.type === 'coin') {
                            // T?o coin m?c d?nh
                            newCard = this.cardManager.cardFactory.createDynamicCoin(this.characterManager);
                        } else if (killEffect.reward.type === 'abysslector') {
                            // T?o AbyssLector m?i
                            newCard = killEffect.reward.card;
                        }
                    } else {
                        // T?o coin m?c d?nh cho c�c enemy kh�ng c� killByWeaponEffect
                        newCard = this.cardManager.cardFactory.createDynamicCoin(this.characterManager);
                    }
                    
                    if (newCard) {
                        newCard.id = monsterIndex;
                        newCard.position = { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 };
                        this.cardManager.updateCard(monsterIndex, newCard);
                        
                        // Warrior kh�ng di chuy?n, ch? render th? m?i
                        this.animationManager.renderCardsWithAppearEffect(monsterIndex);
                        
                        // ===== KH�NG T�NH LU?T V� KH�NG DI CHUY?N =====
                        // KH�NG incrementMoves() v� Warrior kh�ng di chuy?n
                        
                        // ===== SETUP EVENTS L?I CHO TH? M?I =====
                        // �? Warrior c� th? di chuy?n d?n th? m?i
                        this.setupCardEventsAfterCombat();
                        
                        // ===== C?P NH?T UI =====
                        if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                            this.animationManager.eventManager.uiManager.updateUI();
                        }
                        
                        // ===== KI?M TRA GAME OVER =====
                        // if (this.checkGameOver()) {
                        //     this.animationManager.triggerGameOver();
                        //     return;
                        // }
                    }
                }, 600);
            } else {
                // ===== MONSTER C�N S?NG =====
                this.animationManager.updateMonsterDisplay(monsterIndex); // C?p nh?t HP monster
                this.animationManager.updateCharacterDisplay(); // C?p nh?t hi?n th? d? b?n vu kh�
                
                // ===== G?I attackByWeaponEffect N?U C� =====
                if (monster.attackByWeaponEffect) {
                    const cards = this.cardManager.getAllCards();
                    const attackEffect = monster.attackByWeaponEffect(cards, monsterIndex);
                    
                    if (attackEffect && attackEffect.type === 'enemy_attacked_by_weapon') {
                        // X? l� c�c lo?i hi?u ?ng kh�c nhau
                        if (attackEffect.newPosition !== undefined) {
                            // Hi?u ?ng d?i v? tr� (Narwhal)
                            this.cardManager.setAllCards(cards);
                            
                            // Th�m hi?u ?ng flip cho c? 2 th?
                            this.animationManager.flipCards(
                                attackEffect.oldPosition, 
                                attackEffect.newPosition,
                                () => {
                                    // Callback sau khi animation ho�n th�nh
                                    this.animationManager.renderCards();
                                    this.setupCardEventsAfterCombat();
                                }
                            );
                            
                            // Hi?n th? th�ng b�o hi?u ?ng
                        }
                    }
                }
            }
        }, 150);
        
        return true;
    }

    // ===== C�C H�M H? TR? - T?O TH? V� SETUP =====

    /**
     * Setup events l?i cho c�c th? sau combat
     * �u?c g?i sau khi t?o th? m?i d? d?m b?o events ho?t d?ng
     */
    setupCardEventsAfterCombat() {
        // G?i setupCardEvents t? EventManager th�ng qua AnimationManager
        if (this.animationManager.eventManager) {
            this.animationManager.eventManager.setupCardEvents();
        }
    }

    // ===== C�C H�M KI?M TRA TR?NG TH�I =====

    /**
     * Ki?m tra game over
     * @returns {boolean} True n?u character ch?t
     */
    checkGameOver() {
        return !this.characterManager.isAlive();
    }
} 
